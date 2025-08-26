# schemas/lista.py

from pydantic import BaseModel, ConfigDict
from datetime import date
from schema.email import EmailCreate, EmailListCreate

class CampanhaCreate(BaseModel):
    Titulo: str
    Cor: str
    Documento: str

class Campanha(BaseModel): #Usada em create
    Titulo: str
    Cor: str
    Documento: str

class CampanhaGet(BaseModel):
    IdCampanha: int

class CampanhaBase(BaseModel): #Geral
    IdCampanha: int
    Titulo: str
    Cor: str
    Documento: str
    Ultimo_Uso: date
    Lixeira: bool

