# schemas/lista.py

from pydantic import BaseModel, ConfigDict
from datetime import date
from schema.email import EmailCreate, EmailListCreate

class ListaCreate(BaseModel):
    Titulo: str
    Emails: list[str]

class ListaGet(BaseModel):
    IdLista: int

class Lista(BaseModel):
    IdLista: int
    Titulo: str
    Ultimo_Uso: date | None = None
    
    model_config = ConfigDict(from_attributes=True)