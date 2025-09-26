"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, BarChart3, Calendar, Layers, Beaker } from "lucide-react"

// Import the new CircularProgressDisplay component
import { CircularProgressDisplay } from "@/components/ui/circular-progress-display";


interface PredictionResultProps {
  result: {
    request_id: string
    farm_id: string
    predicted_yield_kg_per_ha: number
    confidence_interval?: {
      lower: number
      upper: number
    }
    model_version: string
    feature_importance?: Array<{
      feature: string
      importance: number
    }>
    weather_data?: {
      rainfall: number
      temperature?: number
      humidity?: number
    }
    soil_data?: {
      nitrogen: number
      phosphorus: number
      potassium: number
      ph: number
    }
    fertilizer_recommendation?: {
      recommended_fertilizer: string
      confidence?: number
    }
  }
}

export function PredictionResult({ result }: PredictionResultProps) {
  const {
    predicted_yield_kg_per_ha,
    confidence_interval,
    model_version,
    feature_importance,
    weather_data,
    soil_data,
    fertilizer_recommendation,
  } = result

  // A fallback for the case where confidence interval is missing in the result
  if (!confidence_interval) {
    return (
      <div className="text-center text-red-600 p-8">
        Prediction data is incomplete and cannot be displayed. Confidence interval is missing.
      </div>
    )
  }

  const confidenceRange = confidence_interval.upper - confidence_interval.lower
  const confidencePercentage =
    confidenceRange > 0
      ? ((predicted_yield_kg_per_ha - confidence_interval.lower) /
          confidenceRange) *
        100
      : 50 // Default to 50% if the range is zero

  // --- Soil Feature Max Values for Progress Bars/Circular Displays ---
  // These are example maximums for calculation, the "limits" won't be displayed for N, P, K
  // Adjust these maximums based on the actual expected ranges in your data.
  const MAX_N_FOR_DISPLAY = 200; // Example max for nitrogen, adjust as needed
  const MAX_P_FOR_DISPLAY = 100; // Example max for phosphorus, adjust as needed
  const MAX_K_FOR_DISPLAY = 250; // Example max for potassium, adjust as needed
  const MAX_PH = 14; // pH scale is 0-14

  const getProgressBarValue = (current: number, max: number) => {
    return (current / max) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Main Prediction Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Crop Yield Prediction
          </CardTitle>
          <CardDescription>
            AI-powered crop yield prediction for your farm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div>
              <div className="text-4xl font-bold text-primary">
                {predicted_yield_kg_per_ha.toFixed(1)}
              </div>
              <div className="text-lg text-muted-foreground">kg per hectare</div>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>
                Range: {confidence_interval.lower.toFixed(1)} -{" "}
                {confidence_interval.upper.toFixed(1)} kg/ha
              </span>
              <Badge variant="secondary">{model_version}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Range Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Confidence Range
          </CardTitle>
          <CardDescription>Prediction confidence interval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Lower bound: {confidence_interval.lower.toFixed(1)} kg/ha</span>
              <span>Upper bound: {confidence_interval.upper.toFixed(1)} kg/ha</span>
            </div>
            <Progress value={confidencePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              The predicted yield falls within this confidence range based on
              the model&apos;s analysis.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Factors (Feature Importance) Card */}
      {feature_importance && feature_importance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Key Factors
            </CardTitle>
            <CardDescription>
              Most important factors affecting your yield prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feature_importance.slice(0, 5).map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {factor.feature.replace(/_/g, " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={factor.importance * 100}
                      className="w-20 h-2"
                    />
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {(factor.importance * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Conditions Card */}
      {weather_data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weather Conditions
            </CardTitle>
            <CardDescription>
              Environmental data used in the prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {weather_data.rainfall.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">
                  mm/year rainfall
                </div>
              </div>
              {weather_data.temperature !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {weather_data.temperature.toFixed(1)}°C
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Temperature
                  </div>
                </div>
              )}
              {weather_data.humidity !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {weather_data.humidity.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Humidity</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Soil Composition Card - MODIFIED FOR CIRCULAR PROGRESS */}
      {soil_data && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Soil Composition
            </CardTitle>
            <CardDescription>
              Soil nutrient and pH levels used in the prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {/* Nitrogen Circular Display */}
              <CircularProgressDisplay
                value={soil_data.nitrogen}
                max={MAX_N_FOR_DISPLAY} // Used for calculation only
                unit="kg/ha"
                label="Nitrogen (N)"
                indicatorColorClass="stroke-sky-500"
              />

              {/* Phosphorus Circular Display */}
              <CircularProgressDisplay
                value={soil_data.phosphorus}
                max={MAX_P_FOR_DISPLAY} // Used for calculation only
                unit="kg/ha"
                label="Phosphorus (P)"
                indicatorColorClass="stroke-green-500"
              />

              {/* Potassium Circular Display */}
              <CircularProgressDisplay
                value={soil_data.potassium}
                max={MAX_K_FOR_DISPLAY} // Used for calculation only
                unit="kg/ha"
                label="Potassium (K)"
                indicatorColorClass="stroke-orange-500"
              />

              {/* pH Horizontal Progress Bar (as requested, pH remains a bar) */}
              <div className="w-full max-w-[120px] flex flex-col items-center justify-center space-y-1 mt-4 sm:mt-0">
                <span className="text-sm font-medium">Soil pH</span>
                <span className="text-2xl font-bold">{soil_data.ph.toFixed(1)}</span>
                <Progress value={getProgressBarValue(soil_data.ph, MAX_PH)} className="h-3 w-full bg-blue-500" />
                <span className="text-xs text-muted-foreground">Range: 0-14</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fertilizer Recommendation Card */}
      {fertilizer_recommendation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="w-5 h-5" />
              Fertilizer Recommendation
            </CardTitle>
            <CardDescription>
              AI-driven suggestion for optimal crop nutrition
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">
                  {fertilizer_recommendation.recommended_fertilizer}
              </div>
              {fertilizer_recommendation.confidence !== undefined && (
                <div className="text-sm text-muted-foreground">
                  Confidence:{" "}
                  <strong>
                    {(fertilizer_recommendation.confidence * 100).toFixed(1)}%
                  </strong>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}