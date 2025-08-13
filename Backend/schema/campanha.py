# schemas/lista.py

from pydantic import BaseModel, ConfigDict
from datetime import date
from schema.email import EmailCreate, EmailListCreate

class CampanhaCreate(BaseModel):
    Titulo: str
    Cor: str
    Documento: str

class Campanha(BaseModel):
    Titulo: str
    Cor: str
    Documento: str