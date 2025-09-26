from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import request_validation_exception_handler
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, Dict
import requests
import uuid
from model_utils import predictor
from fertilizer_recommend import FertilizerModelPredictor
import logging

load_dotenv()

app = FastAPI(title="Crop Yield Prediction API", version="1.0.0")
logger = logging.getLogger("uvicorn.error")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("firebase-service-account.json")
        firebase_admin.initialize_app(cred)
        print("✅ Firebase initialized successfully")
    except Exception as e:
        print(f"⚠️ Firebase initialization failed: {e}")
        print("Please add your firebase-service-account.json file")

db = firestore.client()
security = HTTPBearer()

# Instantiate fertilizer model predictor globally
fertilizer_predictor = FertilizerModelPredictor(model_path="ml_models")
fertilizer_load_success = fertilizer_predictor.load_model()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error for request {request.url}: {exc.errors()}")
    return await request_validation_exception_handler(request, exc)

@app.on_event("startup")
async def startup_event():
    if not os.path.isfile("firebase-service-account.json"):
        print("❌ firebase-service-account.json file NOT found in working directory!")
    else:
        print("✅ firebase-service-account.json file found!")
        
    success = predictor.load_model()
    if success:
        crops = predictor.get_available_crops()
        print(f"✅ Available crops: {crops}")
    else:
        print("⚠️ ML model not loaded. Predictions will not work.")

    if fertilizer_load_success:
        print("✅ Fertilizer model loaded successfully")
    else:
        print("⚠️ Fertilizer model failed to load")

class PredictionRequest(BaseModel):
    farm_id: str
    crop: str
    area: float
    N: float
    P: float
    K: float
    ph: float
    fertilizer: float
    pesticide: float
    rainfall: Optional[float] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    moisture: Optional[float] = None
    sowing_date: Optional[str] = None
    soil_type: Optional[str] = None
    crop_type: Optional[str] = None

class FarmData(BaseModel):
    name: str
    location: Dict[str, float]
    soil_type: str
    area_ha: float

class UserProfile(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    role: Optional[str] = "farmer"

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_weather_data(lat: float, lon: float) -> Dict[str, float]:
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return {"temperature": 25.0, "humidity": 60.0, "rainfall": 100.0}
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
        response = requests.get(url)
        data = response.json()
        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "rainfall": data.get("rain", {}).get("1h", 0) * 24
        }
    except Exception as e:
        print(f"Weather API error: {e}")
        return {"temperature": 25.0, "humidity": 60.0, "rainfall": 100.0}

@app.get("/")
async def root():
    return {
        "message": "Crop Yield Prediction API", 
        "status": "running",
        "model_loaded": predictor.is_loaded,
        "available_crops": predictor.get_available_crops() if predictor.is_loaded else []
    }

@app.get("/api/crops")
async def get_available_crops():
    if not predictor.is_loaded:
        raise HTTPException(status_code=503, detail="ML model not available")
    return {"crops": predictor.get_available_crops()}

@app.post("/api/predict")
async def predict_yield(request: PredictionRequest, user=Depends(get_current_user)):
    if not predictor.is_loaded:
        raise HTTPException(status_code=503, detail="ML model not available")

    try:
        user_id = user["uid"]
        request_id = str(uuid.uuid4())

        logger.info(f"Starting prediction for user {user_id} with request id {request_id} and inputs: {request}")

        prediction_ref = db.collection("users").document(user_id).collection("predictions").document(request_id)
        prediction_ref.set({
            "farm_id": request.farm_id,
            "inputs": request.dict(),
            "status": "pending",
            "created_at": datetime.utcnow(),
        })

        rainfall = request.rainfall
        if rainfall is None:
            try:
                farm_ref = db.collection("users").document(user_id).collection("farms").document(request.farm_id)
                farm_doc = farm_ref.get()
                if farm_doc.exists():
                    farm_data = farm_doc.to_dict()
                    weather = get_weather_data(farm_data["location"]["lat"], farm_data["location"]["lon"])
                    rainfall = weather["rainfall"]
                else:
                    rainfall = 100.0
            except Exception as e:
                logger.error(f"Error getting weather data: {e}")
                rainfall = 100.0

        prediction_result = predictor.predict_yield(
            crop=request.crop,
            area=request.area,
            rainfall=rainfall,
            fertilizer=request.fertilizer,
            pesticide=request.pesticide,
        )

        fertilizer_inputs = {
            "temperature": request.temperature,
            "humidity": request.humidity,
            "moisture": request.moisture,
            "soil_type": request.soil_type,
            "crop_type": request.crop_type,
            "nitrogen": request.N,
            "phosphorous": request.P,
            "potassium": request.K,
        }

        fertilizer_result = None
        if fertilizer_load_success:
            try:
                fertilizer_result = fertilizer_predictor.predict(**fertilizer_inputs)
            except Exception as e:
                logger.error(f"Fertilizer prediction failed: {e}")

        result = {
            "request_id": request_id,
            "farm_id": request.farm_id,
            "predicted_yield_kg_per_ha": round(prediction_result["predicted_yield"], 2),
            "confidence_interval": {
                "lower": round(prediction_result["confidence_interval"]["lower"], 2),
                "upper": round(prediction_result["confidence_interval"]["upper"], 2)
            },
            "model_version": prediction_result.get("model_version"),
            "feature_importance": prediction_result.get("feature_importance"),
            "weather_data": {
                "rainfall": rainfall,
                "temperature": request.temperature,
                "humidity": request.humidity,
                "moisture": request.moisture
            }
        }

        if fertilizer_result is not None:
            result["fertilizer_recommendation"] = fertilizer_result

        prediction_ref.update({
            "outputs": result,
            "status": "complete",
            "completed_at": datetime.utcnow(),
        })

        logger.info(f"Prediction completed successfully for request id {request_id}")

        return result

    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        if 'prediction_ref' in locals():
            prediction_ref.update({
                "status": "error",
                "error": str(e),
                "completed_at": datetime.utcnow(),
            })
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/add-farm")
async def add_farm(farm: FarmData, user=Depends(get_current_user)):
    try:
        user_id = user["uid"]
        farm_id = str(uuid.uuid4())

        farm_data = {
            "farm_id": farm_id,
            "name": farm.name,
            "location": farm.location,
            "soil_type": farm.soil_type,
            "area_ha": farm.area_ha,
            "created_at": datetime.utcnow(),
        }

        db.collection("users").document(user_id).collection("farms").document(farm_id).set(farm_data)

        return {"farm_id": farm_id, "message": "Farm added successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add farm: {str(e)}")

@app.get("/api/get-farms")
async def get_farms(user=Depends(get_current_user)):
    try:
        user_id = user["uid"]
        logger.info(f"Fetching farms for user {user_id}")
        farms_ref = db.collection("users").document(user_id).collection("farms")
        farms = [doc.to_dict() for doc in farms_ref.stream()]
        return {"farms": farms}
    except Exception as e:
        logger.error(f"Failed to get farms: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get farms: {str(e)}")

@app.get("/api/get-predictions")
async def get_predictions(user=Depends(get_current_user)):
    try:
        user_id = user["uid"]
        predictions_ref = db.collection("users").document(user_id).collection("predictions")
        predictions = []
        for doc in predictions_ref.order_by("created_at", direction=firestore.Query.DESCENDING).stream():
            predictions.append(doc.to_dict())
        return {"predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get predictions: {str(e)}")

@app.post("/api/update-profile")
async def update_profile(profile: UserProfile, user=Depends(get_current_user)):
    try:
        user_id = user["uid"]

        profile_data = {
            "name": profile.name,
            "email": profile.email,
            "phone": profile.phone,
            "role": profile.role,
            "updated_at": datetime.utcnow(),
        }

        db.collection("users").document(user_id).set(profile_data, merge=True)

        return {"message": "Profile updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)






