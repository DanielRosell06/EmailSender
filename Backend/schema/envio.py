# schemas/envio.py

from pydantic import BaseModel
from typing import List
from datetime import date

class EnvioCreate(BaseModel):
    Campanha: int
    Lista: int

class Detalhe(BaseModel):
    IdDetalhe: int
    Conteudo: str
    Envio: int

    class Config:
        from_attributes = True


class Envio(BaseModel):
    IdEnvio: int
    Campanha: int
    Lista: int
    Dt_Envio: date
    Detalhes: List[Detalhe] = []

    class Config:
        from_attributes = True