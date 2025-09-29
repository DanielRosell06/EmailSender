from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class EnvioCreate(BaseModel):
    Campanha: int
    Lista: int
    UsuarioSmtp: int
    Token: str

class Detalhe(BaseModel):
    IdDetalhe: int
    Conteudo: Optional[str] = None
    
    class Config:
        from_attributes = True

class ListaSchema(BaseModel):
    IdLista: int
    Titulo: str
    
    class Config:
        from_attributes = True

class CampanhaSchema(BaseModel):
    IdCampanha: int
    Titulo: str
    Cor: str
    
    class Config:
        from_attributes = True

class Envio(BaseModel):
    IdEnvio: int
    Campanha: Optional[CampanhaSchema] = None
    Lista: Optional[ListaSchema] = None
    Dt_Envio: date
    Detalhes: List[Detalhe]
    
    class Config:
        from_attributes = True