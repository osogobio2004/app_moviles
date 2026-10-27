from datetime import datetime
from pydantic import BaseModel, ConfigDict

class MissionBase(BaseModel):
    title: str
    details: str | None = None
    deadline: datetime
    couidfk: int
    catidfk: int
    staidfk: int

class MissionCreate(MissionBase):
    pass

class MissionUpdate(BaseModel):
    title: str | None = None
    details: str | None = None
    deadline: datetime | None = None
    couidfk: int | None = None
    catidfk: int | None = None
    staidfk: int | None = None

class MissionResponse(MissionBase):
    misid: int

    model_config = ConfigDict(
        from_attributes=True
    )