import logging
import sys

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from core.config import settings

from api.routes.feedback import router as feedback_router
from api.routes.analytics import router as analytics_router
from api.routes.health import router as health_router

logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    from seed import seed_database
    seed_database()

app.include_router(health_router)
app.include_router(feedback_router)
app.include_router(analytics_router)

@app.get("/")
def root():
    return {"status": "ok"}
