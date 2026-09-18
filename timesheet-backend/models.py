from pydantic import BaseModel

class UtenteModello(BaseModel):
    username: str
    password: str

class TimesheetModello(BaseModel):
    date: str
    hours: float
    project_name: str
    notes: str = ""

