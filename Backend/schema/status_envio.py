# schemas/status_envio.py

from pydantic import BaseModel, ConfigDict
from datetime import date

class Campanha(BaseModel):
    Titulo: str
    Documento: str

class StatusBase(BaseModel):
    IdEmail: str
    Visto: bool

class Status(BaseModel):
    Status: list[StatusBase]
    Campanha: Campanha

    model_config = ConfigDict(from_attributes=True)