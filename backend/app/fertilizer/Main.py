from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import numpy as np
from fertilizer_logic import fertilizer_recommendation

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FertilizerInput(BaseModel):
    state: Optional[str] = None
    sample: Optional[List[float]] = None  # [N, P, K]


@app.get("/")
async def root():
    return {"health check": "ok"}


@app.post("/recommend")
def recommend_fertilizer(data: FertilizerInput):
    if data.state is None and data.sample is None:
        raise HTTPException(status_code=400, detail="Either state or sample (N, P, K) must be provided.")

    sample = None
    if data.sample is not None:
        if len(data.sample) != 3:
            raise HTTPException(status_code=400, detail="Sample must contain exactly 3 values: [N, P, K]")
        sample = np.array(data.sample).reshape(1, -1)

    try:
        result = fertilizer_recommendation(state=data.state, sample=sample)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "state": data.state,
        "sample": data.sample,
        **result
    }