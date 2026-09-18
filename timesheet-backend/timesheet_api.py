from fastapi import Depends, FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime


db_url = "postgresql://postgres:Gianmarco001@localhost/timesheet_db"
engine = create_engine(db_url)

session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UtenteDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password_hash = Column(String)  


class TimesheetDB(Base):
    __tablename__ = "timesheets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    date = Column(Date)
    hours = Column(Float)  
    project_name = Column(String)
    notes = Column(String)


class UtenteModello(BaseModel):
    username: str
    password: str


class TimesheetModello(BaseModel):
    date: str
    hours: float
    project_name: str
    notes: str = ""


class LoginModello(BaseModel):
    username: str
    password: str



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()





@app.post("/register")
def register(utente: UtenteModello, db: Session = Depends(get_db)):
    db_utente = db.query(UtenteDB).filter(UtenteDB.username == utente.username).first()
    if db_utente:
        raise HTTPException(status_code=400, detail="Username già preso")

    nuovo_utente = UtenteDB(username=utente.username, password_hash=utente.password)
    db.add(nuovo_utente)
    db.commit()
    return {"detail": "Registrazione completata!"}




@app.post("/token")
def login(
    dati: LoginModello, 
    db: Session = Depends(get_db),
):
    utente = db.query(UtenteDB).filter(UtenteDB.username == dati.username).first()

    if not utente or utente.password_hash != dati.password:
        raise HTTPException(status_code=400, detail="Credenziali errate")

    return {"access_token": utente.username, "token_type": "bearer"}


@app.post("/timesheet")
def add_timesheet(
    auth: str, timesheet: TimesheetModello, db: Session = Depends(get_db)
):
    utente = db.query(UtenteDB).filter(UtenteDB.username == auth).first()

    data_corretta = datetime.strptime(timesheet.date[:10], "%Y-%m-%d").date()

    nuovo_record = TimesheetDB(
        user_id=utente.id,
        date=data_corretta,
        hours=timesheet.hours,
        project_name=timesheet.project_name,
        notes=timesheet.notes,
    )
    db.add(nuovo_record)
    db.commit()
    return {"detail": "Timesheet salvato!"}

@app.get("/timesheet")
def get_timesheets(auth: str, db: Session = Depends(get_db)):
    utente = db.query(UtenteDB).filter(UtenteDB.username == auth).first()

    db_timesheets = (
        db.query(TimesheetDB).filter(TimesheetDB.user_id == utente.id).all()
    )
    return db_timesheets