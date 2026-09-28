from pydantic import BaseModel
from typing import List, Optional
import enum

class InteractionStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSED = "PROCESSED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"

class Interaction(BaseModel):
    id: int
    media_type: str
    raw_intent: str
    category: str
    severity: int
    status: InteractionStatus
    lng: float
    lat: float

class InfrastructureProject(BaseModel):
    id: int
    title: str
    category: str
    budget: float
    description: Optional[str] = None
    lng: float
    lat: float

class Store:
    interactions: List[Interaction] = []
    projects: List[InfrastructureProject] = []
    interaction_seq = 1
    project_seq = 1

    @classmethod
    def add_interaction(cls, item: dict):
        item['id'] = cls.interaction_seq
        cls.interaction_seq += 1
        obj = Interaction(**item)
        cls.interactions.append(obj)
        return obj

    @classmethod
    def add_project(cls, item: dict):
        item['id'] = cls.project_seq
        cls.project_seq += 1
        obj = InfrastructureProject(**item)
        cls.projects.append(obj)
        return obj

db_store = Store()
