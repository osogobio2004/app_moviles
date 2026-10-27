from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app import models, schemas

app = FastAPI(
    title="Mobile Applications API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8100",
        "http://localhost:8081"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "API is working properly"
    }

def format_mission(m, fields: str = None):
    expand_cat = fields and "catidfk.*" in fields
    expand_sta = fields and "staidfk.*" in fields
    m_dict = {
        "misid": m.misid,
        "title": m.title,
        "details": m.details,
        "deadline": m.deadline,
        "couidfk": m.couidfk,
        "catidfk": m.catidfk,
        "staidfk": m.staidfk
    }
    if expand_cat and m.category:
        m_dict["catidfk"] = {"catid": m.category.catid, "name": m.category.name}
    if expand_sta and m.status:
        m_dict["staidfk"] = {"staid": m.status.staid, "description": m.status.description}
    return m_dict

@app.get("/items/mission")
def get_missions(fields: str = None, db: Session = Depends(get_db)):
    missions = db.query(models.Mission).all()
    result = [format_mission(m, fields) for m in missions]
    return {"data": result}

@app.get("/items/mission/{misid}")
def get_mission(misid: int, fields: str = None, db: Session = Depends(get_db)):
    mission = db.query(models.Mission).filter(models.Mission.misid == misid).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return {"data": format_mission(mission, fields)}

@app.post("/items/mission")
def create_mission(mission: schemas.MissionCreate, db: Session = Depends(get_db)):
    db_mission = models.Mission(**mission.model_dump())
    db.add(db_mission)
    db.commit()
    db.refresh(db_mission)
    return {"data": db_mission}

@app.patch("/items/mission/{misid}")
def update_mission(misid: int, mission: schemas.MissionUpdate, db: Session = Depends(get_db)):
    db_mission = db.query(models.Mission).filter(models.Mission.misid == misid).first()
    if not db_mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    update_data = mission.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_mission, key, value)
        
    db.commit()
    db.refresh(db_mission)
    return {"data": db_mission}