from pydantic import BaseModel
from typing import Optional

class Detalhe(BaseModel):
    IdDetalhe: int
    Conteudo: Optional[str] = None
    Tipo: int
    Codigo: Optional[int] = None
    Envio: int
    Email: Optional[int] = None
    
    class Config:
        from_attributes = True

class DetalheComEmail(BaseModel):
    IdDetalhe: int
    Conteudo: Optional[str] = None
    Tipo: int
    Codigo: Optional[int] = None
    Envio: int
    Email: Optional[int] = None
    ConteudoEmail: Optional[str] = None
    
    class Config:
        from_attributes = True