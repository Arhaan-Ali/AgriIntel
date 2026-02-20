from fastapi import FastAPI, File, UploadFile, HTTPException, Body, Request
from fastapi.responses import JSONResponse
from app.model.predictor import predict
from app.model.loader import load_model
from app.model.config import Class_name
from PIL import Image
import io
import torch
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
import traceback

app = FastAPI()

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": traceback.format_exc()}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model, class_names = load_model(model_path="soil_classifier_model.pt",
                   num_classes=4)
model.to(device)
model.eval()

import joblib
import numpy as np
from pydantic import BaseModel

crop_model = joblib.load("random_forest_crop_model.pkl")


class CropRecommendationInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@app.get("/")
async def root():
    return {"health check": "ok"}


@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):

    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    predicted_class, confidence = predict(model, device, image, Class_name)

    return {
        "predicted class": predicted_class,
        "confidence": round(confidence, 2)
    }

@app.post("/predict-crop/")
async def predict_crop(data: CropRecommendationInput):

    input_features = np.array([[
        data.N,
        data.P,
        data.K,
        data.temperature,
        data.humidity,
        data.ph,
        data.rainfall
    ]])

    prediction = crop_model.predict(input_features)[0]

    return {
        "recommended_crop": str(prediction)
    }