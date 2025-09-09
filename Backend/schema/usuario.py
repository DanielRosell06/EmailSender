from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class Usuario(BaseModel):
    Nome: str
    Email: str
    Senha: str