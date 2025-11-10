# schemas/status_envio.py

from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional

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

class ListaBase(BaseModel):
    IdLista: int
    Titulo: str

# Schema para a Campanha (usado dentro do EnvioWithStats)
class CampanhaBase(BaseModel):
    IdCampanha: int
    Titulo: str
    Cor: str
    Assunto: str
    Documento: Optional[str] = None

# Schema para o envio com estatísticas
class EnvioWithStatsBase(BaseModel):
    IdEnvio: int
    Dt_Envio: date
    Token: Optional[str] = None
    IdLista: int
    IdCampanha: int
    Lista: ListaBase
    Campanha: CampanhaBase
    entregas: int
    aberturas: int

    model_config = ConfigDict(from_attributes=True)