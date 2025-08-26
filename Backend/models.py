# models.py

from sqlalchemy import Column, Integer, String, Boolean, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Lista(Base):
    __tablename__ = "lista"
    
    IdLista = Column(Integer, primary_key=True, nullable=False, index=True)
    Titulo = Column(String, nullable=False)
    Ultimo_Uso = Column(Date, default=func.now())
    
    # Relacionamento com Email (uma lista tem muitos emails)
    emails = relationship("Email", back_populates="lista_pai")

class Campanha(Base):
    __tablename__ = "campanha"
    
    IdCampanha = Column(Integer, primary_key=True, nullable=False, index=True)
    Titulo = Column(String, nullable=False)
    Cor = Column(String, nullable=False)
    Documento = Column(Text)
    Ultimo_Uso = Column(Date, default=func.now())
    Favorita = Column(Boolean, default=False)
    Lixeira = Column(Boolean, default=False)

class Email(Base):
    __tablename__ = "email"
    
    IdEmail = Column(Integer, primary_key=True, nullable=False, index=True)
    Conteudo = Column(String, nullable=False)
    
    # Chave Estrangeira
    Lista = Column(Integer, ForeignKey("lista.IdLista"))
    
    # Relacionamento de volta para Lista
    lista_pai = relationship("Lista", back_populates="emails")

class Envio(Base):
    __tablename__ = "envio"
    
    IdEnvio = Column(Integer, primary_key=True, nullable=False, index=True)
    Dt_Envio = Column(Date, nullable=False, default=func.now())

    #Chaves estrangeiras
    Lista = Column(Integer, ForeignKey("lista.IdLista"))
    Campanha = Column(Integer, ForeignKey("campanha.IdCampanha"))

    # Relacionamento com lista e campanha
    lista_pai = relationship("Lista")
    campanha_pai = relationship("Campanha")

    # Relacionamento com Detalhe (um envio tem muitos detalhes)
    detalhes = relationship("Detalhe", back_populates="envio_pai")

class Detalhe(Base):
    __tablename__ = "detalhe"
    
    IdDetalhe = Column(Integer, primary_key=True, nullable=False, index=True)
    Conteudo = Column(String, nullable=False)
    
    # Chave Estrangeira
    Envio = Column(Integer, ForeignKey("envio.IdEnvio"))
    
    # Relacionamento de volta para Envio
    envio_pai = relationship("Envio", back_populates="detalhes")

class StatusEnvio(Base):
    __tablename__ = "status_envio"

    IdStatusEnvio = Column(Integer, primary_key=True, nullable=False, index=True)
    
    # Chaves estrangeiras
    IdEnvio = Column(Integer, ForeignKey("envio.IdEnvio"), nullable=False)
    IdEmail = Column(Integer, ForeignKey("email.IdEmail"), nullable=False)
    
    # Coluna para o token
    Token = Column(String, unique=True, index=True)
    
    # Coluna para o status
    Visto = Column(Boolean, default=False)
    
    # Relacionamentos
    envio_pai = relationship("Envio")
    email_pai = relationship("Email")