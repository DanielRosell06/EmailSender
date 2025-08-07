# models.py

from sqlalchemy import Column, Integer, String
from database import Base # Importação absoluta está correta aqui

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    descricao = Column(String)