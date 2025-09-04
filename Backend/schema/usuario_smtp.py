from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class UsuarioSmtp(BaseModel):
    Usuario: str
    Senha: str
    Dominio: str
    Porta: str

class UsuarioSmtpComIdUsuarioSmtpSemSenha(BaseModel):
    IdUsuarioSmtp: int
    Usuario: str
    Dominio: str
    Porta: str