from __future__ import annotations

import io
import os
import asyncio
from datetime import date, timedelta
from pathlib import Path
from typing import Any

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    # Load from project root or backend directory
    env_path = Path(__file__).resolve().parents[2] / ".env"  # Project root
    if not env_path.exists():
        env_path = Path(__file__).resolve().parents[1] / ".env"  # Backend directory
    if env_path.exists():
        load_dotenv(env_path)
    else:
        # Try .env.local as well
        env_local = Path(__file__).resolve().parents[2] / ".env.local"
        if env_local.exists():
            load_dotenv(env_local)
except ImportError:
    # dotenv not installed, skip
    pass

# Force reload numpy to avoid cached version issues
import sys
if 'numpy' in sys.modules:
    del sys.modules['numpy']
import numpy as np

import httpx
import joblib
import pickle
import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Body
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from .crop_soil.model.config import Class_name
from .crop_soil.model.loader import load_model
from .crop_soil.model.predictor import predict as predict_soil


BACKEND_DIR = Path(__file__).resolve().parents[1]  # .../backend
FERTILIZER_DIR = BACKEND_DIR / "app" / "fertilizer"

SOIL_MODEL_PATH = BACKEND_DIR / "soil_classifier_model.pt"
CROP_MODEL_PATH = BACKEND_DIR / "random_forest_crop_model.pkl"
YIELD_MODEL_PATH = BACKEND_DIR / "random_forest_crop_yield_model.pkl"
FERTILIZER_MODEL_PATH = FERTILIZER_DIR / "fertilizer_model.pkl"
FERTILIZER_STATE_CSV = FERTILIZER_DIR / "state_soil_summary.csv"
FERTILIZER_DOSAGE_CSV = FERTILIZER_DIR / "dosage_recommendation.csv"


def _open_meteo_weathercode_to_openweather_icon(weather_code: int) -> tuple[str, str]:
    """
    Returns (description, openweather_icon_code) so the frontend can reuse existing UI.
    Icon codes: https://openweathermap.org/weather-conditions (e.g. 01d, 03d, 10d, 11d, 13d, 50d)
    """
    if weather_code == 0:
        return ("Clear sky", "01d")
    if weather_code in (1, 2):
        return ("Partly cloudy", "02d")
    if weather_code == 3:
        return ("Overcast", "04d")
    if weather_code in (45, 48):
        return ("Fog", "50d")
    if 51 <= weather_code <= 57:
        return ("Drizzle", "09d")
    if 61 <= weather_code <= 67:
        return ("Rain", "10d")
    if 71 <= weather_code <= 77:
        return ("Snow", "13d")
    if weather_code in (80, 81, 82):
        return ("Rain showers", "09d")
    if weather_code in (85, 86):
        return ("Snow showers", "13d")
    if weather_code in (95, 96, 99):
        return ("Thunderstorm", "11d")
    return ("Weather", "03d")


async def fetch_weather_and_rainfall(lat: float, lon: float) -> dict[str, Any]:
    # Current weather (no API key)
    forecast_url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,weather_code"
        "&timezone=auto"
    )

    # Last 30 days daily precipitation (archive API, no key)
    end = date.today() - timedelta(days=1)
    start = end - timedelta(days=29)
    archive_url = (
        "https://archive-api.open-meteo.com/v1/archive"
        f"?latitude={lat}&longitude={lon}"
        f"&start_date={start.isoformat()}&end_date={end.isoformat()}"
        "&daily=precipitation_sum&timezone=auto"
    )

    timeout = httpx.Timeout(10.0, connect=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        forecast_res, archive_res = await asyncio.gather(
            client.get(forecast_url),
            client.get(archive_url),
        )

    if forecast_res.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch weather data")

    forecast_json = forecast_res.json()
    current = forecast_json.get("current") or {}
    temp_c = float(current.get("temperature_2m", 0.0))
    humidity = float(current.get("relative_humidity_2m", 0.0))
    wind = float(current.get("wind_speed_10m", 0.0))
    clouds = float(current.get("cloud_cover", 0.0))
    weather_code = int(current.get("weather_code", 0))
    description, icon = _open_meteo_weathercode_to_openweather_icon(weather_code)

    rainfall_last_30d = 0.0
    rainfall_daily_avg = 0.0
    if archive_res.status_code == 200:
        archive_json = archive_res.json()
        daily = archive_json.get("daily") or {}
        precipitation = daily.get("precipitation_sum") or []
        if isinstance(precipitation, list) and precipitation:
            vals = [float(x or 0.0) for x in precipitation]
            rainfall_last_30d = float(sum(vals))
            rainfall_daily_avg = float(rainfall_last_30d / len(vals))

    return {
        "temperature_c": temp_c,
        "humidity_pct": humidity,
        "wind_speed_ms": wind,
        "cloud_cover_pct": clouds,
        "weather_code": weather_code,
        "weather_description": description,
        "weather_icon": icon,
        "rainfall_last_30d_mm": rainfall_last_30d,
        "rainfall_daily_avg_mm": rainfall_daily_avg,
    }


app = FastAPI(title="HackCU Backend", version="0.1.0")

# CORS configuration - allow all origins in development
# This helps when accessing from different IPs or ports
cors_origins = ["*"]  # Allow all origins for development

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load ML models once at import time
try:
    soil_model, soil_device = load_model(str(SOIL_MODEL_PATH), num_classes=len(Class_name))
except Exception as e:  # pragma: no cover
    soil_model, soil_device = None, None
    soil_load_error = str(e)
else:
    soil_load_error = None

try:
    crop_model = joblib.load(str(CROP_MODEL_PATH))
except Exception as e:  # pragma: no cover
    crop_model = None
    crop_load_error = str(e)
else:
    crop_load_error = None

try:
    yield_model = joblib.load(str(YIELD_MODEL_PATH))
except Exception as e:  # pragma: no cover
    yield_model = None
    yield_load_error = str(e)
else:
    yield_load_error = None

# Load fertilizer model and data
try:
    fertilizer_model = None
    if FERTILIZER_MODEL_PATH.exists():
        try:
            with open(FERTILIZER_MODEL_PATH, "rb") as f:
                fertilizer_model = pickle.load(f)
        except Exception:
            fertilizer_model = None
    
    fertilizer_df = None
    if FERTILIZER_STATE_CSV.exists():
        try:
            fertilizer_df = pd.read_csv(FERTILIZER_STATE_CSV)
        except Exception:
            fertilizer_df = None
    
    fertilizer_dosage_df = None
    if FERTILIZER_DOSAGE_CSV.exists():
        try:
            fertilizer_dosage_df = pd.read_csv(FERTILIZER_DOSAGE_CSV)
        except Exception as e:
            fertilizer_dosage_df = None
    
    fertilizer_load_error = None
except Exception as e:  # pragma: no cover
    fertilizer_model = None
    fertilizer_df = None
    fertilizer_dosage_df = None
    fertilizer_load_error = str(e)


def rule_based_fertilizer_recommendation(N: float, P: float, K: float):
    """Rule-based fertilizer recommendation based on NPK values."""
    # Thresholds for low/medium/high (typical ranges: N: 0-100, P: 0-50, K: 0-100)
    LOW_N = 30
    LOW_P = 15
    LOW_K = 30
    
    recommendations = []
    confidence_scores = {}
    
    # Determine deficiencies
    low_n = N < LOW_N
    low_p = P < LOW_P
    low_k = K < LOW_K
    
    low_count = sum([low_n, low_p, low_k])
    
    # Rule-based recommendations
    if low_count == 0:
        recommendations.append("no fertilizer needed")
        confidence_scores["no fertilizer needed"] = "100%"
    elif low_count == 3:
        recommendations.append("npk_complex")
        confidence_scores["npk_complex"] = "95%"
    elif low_n and low_p:
        recommendations.append("dap")
        confidence_scores["dap"] = "90%"
    elif low_n and low_k:
        recommendations.append("npk_complex")
        confidence_scores["npk_complex"] = "85%"
    elif low_n:
        recommendations.append("Urea")
        confidence_scores["Urea"] = "90%"
    elif low_p:
        recommendations.append("ssp")
        confidence_scores["ssp"] = "90%"
    elif low_k:
        recommendations.append("mop")
        confidence_scores["mop"] = "90%"
    
    # Convert to dict format
    fertilizer_dict = {}
    for rec in recommendations[:3]:  # Top 3
        if rec in confidence_scores:
            fertilizer_dict[rec] = confidence_scores[rec]
    
    return fertilizer_dict


def get_fertilizer_dosage(fertilizer_names: list):
    """Get dosage recommendations for fertilizer names."""
    global fertilizer_dosage_df
    
    # Reload CSV if not loaded (fallback)
    if fertilizer_dosage_df is None and FERTILIZER_DOSAGE_CSV.exists():
        try:
            fertilizer_dosage_df = pd.read_csv(FERTILIZER_DOSAGE_CSV)
        except Exception:
            fertilizer_dosage_df = None
    
    dosage = []
    if fertilizer_dosage_df is not None and not fertilizer_dosage_df.empty:
        for fert_name in fertilizer_names:
            if fert_name.lower() == "no fertilizer needed":
                continue
            
            # Try case-insensitive exact match
            try:
                matches = fertilizer_dosage_df[
                    fertilizer_dosage_df["fertilizers"].str.lower().str.strip() == fert_name.lower().strip()
                ]
                
                if not matches.empty:
                    value = matches.iloc[0]["Dosage"]
                    dosage.append({fert_name: str(value)})
                    continue
            except Exception:
                pass
            
            # Handle special cases
            if fert_name.lower() == "mop":
                # MOP (Muriate of Potash) default dosage
                dosage.append({fert_name: "50-100 kg/ha"})
            elif fert_name.lower() == "npk_complex":
                # Check if npk_complex is in CSV
                try:
                    npk_match = fertilizer_dosage_df[
                        fertilizer_dosage_df["fertilizers"].str.lower() == "npk_complex"
                    ]
                    if not npk_match.empty:
                        value = npk_match.iloc[0]["Dosage"]
                        dosage.append({fert_name: str(value)})
                    else:
                        # Fallback to any NPK complex fertilizer
                        npk_matches = fertilizer_dosage_df[
                            fertilizer_dosage_df["fertilizers"].str.contains("Fourteen|Seventeen|Twenty", case=False, na=False)
                        ]
                        if not npk_matches.empty:
                            value = npk_matches.iloc[0]["Dosage"]
                            dosage.append({fert_name: str(value)})
                        else:
                            dosage.append({fert_name: "150-200 kg/ha"})  # Default NPK dosage
                except Exception:
                    dosage.append({fert_name: "150-200 kg/ha"})
    return dosage


def ml_fertilizer_recommendation(sample: np.ndarray):
    """Get fertilizer recommendation using ML model or rule-based fallback."""
    try:
        N, P, K = float(sample[0][0]), float(sample[0][1]), float(sample[0][2])
    except (IndexError, ValueError, TypeError):
        return {
            "fertilizer": {},
            "micronutrients": ["no_micronutrient_needed"],
            "dosage": [],
            "error": "Invalid NPK values"
        }
    
    # Try ML model first
    if fertilizer_model is not None:
        try:
            proba = fertilizer_model.predict_proba(sample)[0]
            classes = fertilizer_model.classes_
            top_indices = np.argsort(proba)[::-1][:3]
            
            fertilizers = {}
            for i in top_indices:
                fertilizers[str(classes[i])] = f"{round(proba[i] * 100, 2)}%"
            
            micronutrients = ["no_micronutrient_needed"]
            dosage = get_fertilizer_dosage(list(fertilizers.keys()))
            
            return {
                "fertilizer": fertilizers,
                "micronutrients": micronutrients,
                "dosage": dosage
            }
        except Exception as e:
            # Fall through to rule-based if ML fails
            pass
    
    # Rule-based fallback
    try:
        fertilizer_dict = rule_based_fertilizer_recommendation(N, P, K)
        dosage = get_fertilizer_dosage(list(fertilizer_dict.keys()))
        
        return {
            "fertilizer": fertilizer_dict,
            "micronutrients": ["no_micronutrient_needed"],
            "dosage": dosage
        }
    except Exception as e:
        return {
            "fertilizer": {},
            "micronutrients": ["no_micronutrient_needed"],
            "dosage": [],
            "error": str(e)
        }


def predict_yield_over_time(
    rainfall: float,
    fertilizer: float,
    temperature: float,
    N: float,
    P: float,
    K: float,
    days: int = 30,
):
    """Generate yield predictions over time with some variation."""
    if yield_model is None:
        return []
    
    try:
        # Base prediction
        base_input = np.array([[
            rainfall,
            fertilizer,
            temperature,
            N,
            P,
            K
        ]], dtype=float)
        
        # Get base prediction (classifier returns discrete class)
        base_yield = float(yield_model.predict(base_input)[0])
        
        # If model has predict_proba, use it for smoother predictions
        if hasattr(yield_model, 'predict_proba'):
            try:
                proba = yield_model.predict_proba(base_input)[0]
                classes = yield_model.classes_
                # Weighted average of classes by probability
                base_yield = float(np.sum(classes * proba))
            except Exception:
                pass
        
        # Generate predictions over time with realistic variation
        predictions = []
        start_date = date.today()
        
        # Use a seed for consistent results (based on input values)
        seed = int(sum([rainfall, fertilizer, temperature, N, P, K]) % 1000)
        np.random.seed(seed)
        
        for i in range(days):
            # Add some variation (±10-15% with some trend)
            variation = np.random.normal(0, 0.08)  # 8% std deviation
            trend = np.sin(i / 10) * 0.05  # Slight seasonal trend
            noise = np.random.normal(0, 0.5)  # Small random noise
            predicted_yield = base_yield * (1 + variation + trend) + noise
            
            # Ensure yield is positive and reasonable (yield typically 5-15 Q/acre)
            predicted_yield = max(5.0, min(predicted_yield, base_yield * 1.5))
            
            predictions.append({
                "date": (start_date + timedelta(days=i)).isoformat(),
                "yield": round(float(predicted_yield), 2)
            })
        
        return predictions
    except Exception as e:
        return []


@app.get("/health")
async def health():
    return {
        "ok": True,
        "soil_model_loaded": soil_model is not None,
        "crop_model_loaded": crop_model is not None,
        "yield_model_loaded": yield_model is not None,
        "fertilizer_model_loaded": fertilizer_model is not None,
        "soil_model_error": soil_load_error,
        "crop_model_error": crop_load_error,
        "yield_model_error": yield_load_error,
        "fertilizer_model_error": fertilizer_load_error,
    }


@app.get("/weather")
async def weather(lat: float, lon: float):
    return {"ok": True, "data": await fetch_weather_and_rainfall(lat, lon)}


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    N: float = Form(...),
    P: float = Form(...),
    K: float = Form(...),
    ph: float = Form(...),
    lat: float = Form(...),
    lon: float = Form(...),
):
    if soil_model is None:
        raise HTTPException(status_code=500, detail=f"Soil model failed to load: {soil_load_error}")
    if crop_model is None:
        raise HTTPException(status_code=500, detail=f"Crop model failed to load: {crop_load_error}")

    # Image -> soil type
    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    soil_type, soil_confidence = predict_soil(soil_model, soil_device, image, Class_name)

    # Location -> weather/rainfall
    weather_summary = await fetch_weather_and_rainfall(lat, lon)
    temperature = float(weather_summary["temperature_c"])
    humidity = float(weather_summary["humidity_pct"])
    rainfall = float(weather_summary["rainfall_last_30d_mm"])

    # NPK+pH+weather -> crop
    input_features = np.array([[N, P, K, temperature, humidity, ph, rainfall]], dtype=float)
    recommended_crop = crop_model.predict(input_features)[0]

    # NPK -> fertilizer recommendation
    npk_sample = np.array([[N, P, K]], dtype=float)
    fertilizer_rec = ml_fertilizer_recommendation(npk_sample)

    # Yield prediction - use average fertilizer value from recommendation or default
    fertilizer_value = 70.0  # Default average
    if fertilizer_rec.get("fertilizer") and len(fertilizer_rec["fertilizer"]) > 0:
        # Extract numeric value from first fertilizer recommendation if available
        # For now, use a reasonable default based on common fertilizer application
        fertilizer_value = 75.0
    
    # Generate yield predictions over time (30 days)
    yield_predictions = predict_yield_over_time(
        rainfall=rainfall,
        fertilizer=fertilizer_value,
        temperature=temperature,
        N=N,
        P=P,
        K=K,
        days=30
    )

    return {
        "ok": True,
        "inputs": {
            "N": N,
            "P": P,
            "K": K,
            "ph": ph,
            "lat": lat,
            "lon": lon,
        },
        "weather": weather_summary,
        "predictions": {
            "soil_type": str(soil_type),
            "soil_confidence_pct": round(float(soil_confidence), 2),
            "recommended_crop": str(recommended_crop),
            "fertilizer_recommendation": fertilizer_rec,
            "yield_predictions": yield_predictions,
        },
    }


class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []

@app.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    """
    Proxy endpoint for Gemini chat API to avoid CORS issues.
    Uses google-generativeai SDK for reliable communication.
    """
    try:
        import google.generativeai as genai
        
        # Get API key from environment
        gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("NEXT_PUBLIC_GEMINI_API_KEY")
        if not gemini_api_key:
            raise HTTPException(
                status_code=500,
                detail="Gemini API key not configured. Please set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY environment variable."
            )
        
        # Configure the API
        genai.configure(api_key=gemini_api_key)
        
        # Get message and history from request
        message = request.message
        history = request.conversation_history if request.conversation_history else []
        
        # Models to try in order - prioritize free tier models first
        # Free tier typically has: gemini-pro, gemini-1.5-flash, gemini-1.5-pro
        models_to_try = [
            "gemini-1.5-flash",      # Free tier, fast and reliable
            "gemini-pro",             # Free tier, basic model (always available)
            "gemini-1.5-pro",        # Free tier, more capable (may have rate limits)
            "gemini-2.5-flash",      # Newer model (if available)
            "gemini-2.0-flash",      # Alternative
            "gemini-flash-latest",   # Latest alias
        ]
        
        last_error = None
        
        for model_name in models_to_try:
            try:
                # Get the model
                model = genai.GenerativeModel(model_name)
                
                # Prepare conversation history for the SDK
                # Convert our format to SDK format
                chat_history = []
                for msg in history:
                    if msg.get("role") == "user":
                        chat_history.append({"role": "user", "parts": [msg["parts"][0]["text"]]})
                    elif msg.get("role") == "model":
                        chat_history.append({"role": "model", "parts": [msg["parts"][0]["text"]]})
                
                # System instruction for farming expertise
                system_instruction = (
                    "You are an expert agricultural assistant specialized in helping farmers. "
                    "Your expertise includes: crop selection, soil management (NPK, pH), "
                    "pest/disease identification, irrigation, fertilizer recommendations, "
                    "yield optimization, seasonal practices, organic farming, and market information. "
                    "\n\nCRITICAL: Always format responses as bullet points. Keep answers under 150 words. "
                    "Use simple language. Be practical and actionable."
                )
                
                # Generation config for shorter, concise responses
                # Note: max_output_tokens may not be supported by all free tier models
                # So we rely on system instruction to keep responses short
                generation_config = {
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "top_k": 40,
                    # Don't use max_output_tokens - it may cause errors with free tier
                    # System instruction already requests short responses
                }
                
                # Handle conversation with fallback for free tier models
                try:
                    if chat_history:
                        # Continue existing conversation
                        chat = model.start_chat(
                            history=chat_history,
                            generation_config=generation_config
                        )
                        response = chat.send_message(message)
                    else:
                        # First message - try with system_instruction (may not work on all free tier models)
                        try:
                            model_with_instruction = genai.GenerativeModel(
                                model_name=model_name,
                                system_instruction=system_instruction,
                                generation_config=generation_config
                            )
                            response = model_with_instruction.generate_content(message)
                        except Exception as sys_err:
                            # Fallback: include system instruction in the message itself
                            # This works with all free tier models including older ones
                            full_message = f"{system_instruction}\n\nUser question: {message}"
                            response = model.generate_content(
                                full_message,
                                generation_config=generation_config
                            )
                except Exception as gen_err:
                    # If generation_config fails, try without it
                    print(f"Generation config error, retrying without config: {str(gen_err)}")
                    if chat_history:
                        chat = model.start_chat(history=chat_history)
                        response = chat.send_message(message)
                    else:
                        full_message = f"{system_instruction}\n\nUser question: {message}"
                        response = model.generate_content(full_message)
                
                # Extract response text
                assistant_message = response.text
                
                return {
                    "ok": True,
                    "message": assistant_message,
                }
                
            except Exception as e:
                error_msg = str(e)
                last_error = error_msg
                import traceback
                print(f"Error with model {model_name}: {error_msg}")
                print(f"Full traceback: {traceback.format_exc()}")
                # If model not found, try next one
                if "not found" in error_msg.lower() or "not available" in error_msg.lower():
                    continue
                # If it's a generation config error, try without it
                if "generation_config" in error_msg.lower() or "generationConfig" in error_msg.lower() or "max_output_tokens" in error_msg.lower():
                    try:
                        # Retry without generation_config
                        if chat_history:
                            chat = model.start_chat(history=chat_history)
                            response = chat.send_message(message)
                        else:
                            full_message = f"{system_instruction}\n\nUser question: {message}"
                            response = model.generate_content(full_message)
                        assistant_message = response.text
                        return {
                            "ok": True,
                            "message": assistant_message,
                        }
                    except:
                        continue
                # For other errors, try next model
                continue
        
        # If all models failed
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get response from Gemini API. Last error: {last_error or 'All models failed.'}"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with Gemini API: {str(e)}"
        )


