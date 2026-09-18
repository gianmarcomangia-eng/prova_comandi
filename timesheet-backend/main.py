from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import Depends, FastAPI, HTTPException, Form
import database_models
import models
from database import engine, session

app = FastAPI()


app.add_middleware( # aggiunto con IA, CORS
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


def get_authenticated_user(auth: str, db: Session):
    utente = db.query(database_models.UtenteDB).filter(database_models.UtenteDB.username == auth).first()
    if not utente:
        raise HTTPException(status_code=401, detail="Utente non trovato o non autenticato")
    return utente


@app.post("/register")
def register(utente: models.UtenteModello, db: Session = Depends(get_db)):
    db_utente = db.query(database_models.UtenteDB).filter(database_models.UtenteDB.username == utente.username).first()
    if db_utente:
        raise HTTPException(status_code=400, detail="Username già preso") # aggiunta dopo prima usavo un semplice return {} 

    nuovo_utente = database_models.UtenteDB(username=utente.username, password_hash=utente.password)
    db.add(nuovo_utente)
    db.commit()
    return {"username": utente.username, "messaggio": "Creato con successo"}


@app.post("/token")
def login( # aggiunto dopo form con ia perche mi dava errore quando facevo il login con errore 422 Unprocessable Content
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db),
):
    
    utente = db.query(database_models.UtenteDB).filter(database_models.UtenteDB.username == username).first()

    if utente and utente.password_hash == password:
        return {"access_token": utente.username, "token_type": "bearer"} # aggiunto con Ia
    else:
        raise HTTPException(status_code=400, detail="Credenziali errate")

    


@app.post("/timesheet")
def add_timesheet(
    auth: str, timesheet: models.TimesheetModello, db: Session = Depends(get_db)
):
    utente = get_authenticated_user(auth, db)

    data_corretta = datetime.strptime(timesheet.date[:10], "%Y-%m-%d").date()

    nuovo_record = database_models.TimesheetDB( # aggiunto con ia
        user_id=utente.id,
        date=data_corretta,
        hours=timesheet.hours,
        project_name=timesheet.project_name,
        notes=timesheet.notes,
    )
    db.add(nuovo_record)
    db.commit()
    return {"ore_salvate": timesheet.hours, "progetto": timesheet.project_name}


@app.get("/timesheet")
def get_timesheets(auth: str, db: Session = Depends(get_db)):
    utente = get_authenticated_user(auth, db)

    db_timesheets = (
        db.query(database_models.TimesheetDB).filter(database_models.TimesheetDB.user_id == utente.id).all()
    )
    return db_timesheets