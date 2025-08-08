# schemas/lista.py

from pydantic import BaseModel, ConfigDict
from datetime import date

class ListaCreate(BaseModel):
    Titulo: str

class Lista(BaseModel):
    IdLista: int
    Titulo: str
    Ultimo_Uso: date | None = None
    
    model_config = ConfigDict(from_attributes=True)