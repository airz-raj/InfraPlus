from fastapi import APIRouter, Query, status
from typing import Optional
import numpy as np
from sklearn.linear_model import LinearRegression
from pydantic import BaseModel

from api.schemas import HotspotFeature, HotspotFeatureProperties, HotspotGeoJSON
from core.store import db_store

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

@router.get("/hotspots", response_model=HotspotGeoJSON)
async def get_hotspots(
    category: Optional[str] = Query(default=None),
    min_severity: Optional[int] = Query(default=None, ge=1, le=5),
):
    features = []

    for i in db_store.interactions:
        if category and i.category.lower() != category.lower(): continue
        if min_severity and i.severity < min_severity: continue
        
        features.append(HotspotFeature(
            geometry={"type": "Point", "coordinates": [i.lng, i.lat]},
            properties=HotspotFeatureProperties(
                interaction_id=i.id, category=i.category, severity=i.severity,
                status=i.status.value, feature_type="complaint"
            )
        ))

    for p in db_store.projects:
        if category and p.category.lower() != category.lower(): continue
        features.append(HotspotFeature(
            geometry={"type": "Point", "coordinates": [p.lng, p.lat]},
            properties=HotspotFeatureProperties(
                category=p.category, feature_type="project",
                title=p.title, budget=p.budget, description=p.description
            )
        ))

    return HotspotGeoJSON(features=features)

class ForecastPoint(BaseModel):
    month: str
    actual: Optional[float] = None
    predicted: float

class ForecastResponse(BaseModel):
    data: list[ForecastPoint]

@router.get("/predictive-demand", response_model=ForecastResponse)
async def get_predictive_demand():
    total = len(db_store.interactions) or 50
    base = int(total / 2) + 20
    
    y_hist = np.array([base, base + 7, base + 18])
    x_hist = np.array([1, 2, 3]).reshape(-1, 1)
    
    model = LinearRegression()
    model.fit(x_hist, y_hist)
    
    x_pred = np.array([1, 2, 3, 4, 5, 6]).reshape(-1, 1)
    y_pred = model.predict(x_pred)
    
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    data = []
    for i in range(6):
        data.append(ForecastPoint(
            month=months[i],
            actual=float(y_hist[i]) if i < 3 else None,
            predicted=float(round(y_pred[i], 1))
        ))
        
    return ForecastResponse(data=data)
