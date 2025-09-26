import { getIdToken } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

class ApiClient {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await getIdToken()
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = await this.getHeaders()

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Farm management
  async addFarm(farmData: {
    name: string
    location: { lat: number; lon: number }
    soil_type: string
    area_ha: number
  }) {
    return this.request("/api/add-farm", {
      method: "POST",
      body: JSON.stringify(farmData),
    })
  }

  async getFarms() {
    return this.request<{ farms: any[] }>("/api/get-farms")
  }

  // Predictions
  async predictYield(predictionData: {
    farm_id: string
    crop: string
    soil_type?: string       // Added optional soil_type
    crop_type?: string       // Added optional crop_type
    N: number
    P: number
    K: number
    ph: number
    temperature?: number
    humidity?: number
    rainfall?: number
    moisture?: number
    sowing_date: string
    area: number
    fertilizer: number
    pesticide: number
  }) {
    return this.request("/api/predict", {
      method: "POST",
      body: JSON.stringify(predictionData),
    })
  }

  async getPredictions() {
    return this.request<{ predictions: any[] }>("/api/get-predictions")
  }

  // Profile management
  async updateProfile(profileData: {
    name: string
    email: string
    phone?: string
    role?: string
  }) {
    return this.request("/api/update-profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    })
  }
}

export const apiClient = new ApiClient()
