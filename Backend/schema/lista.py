# schemas/lista.py

from pydantic import BaseModel, ConfigDict
from datetime import date

class ListaCreate(BaseModel):
    Titulo: str
    Emails: list[str]

class ListaGet(BaseModel):
    IdLista: int

class Email(BaseModel):
    IdEmail: int
    Conteudo: str

class ListaComEmail(BaseModel):
    IdLista: int
    Titulo: str
    Ultimo_Uso: date | None = None
    Emails: list[Email]
    
    model_config = ConfigDict(from_attributes=True)

class Lista(BaseModel):
    IdLista: int
    Titulo: str
    Ultimo_Uso: date | None = None
    Lixeira: bool
    
    model_config = ConfigDict(from_attributes=True)