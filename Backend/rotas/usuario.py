# rotas/envio.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schema import usuario as schemas_usuario
from crud import usuario as crud_usuario

# Importa a instância global do SocketIO do main.py
# É crucial que essa linha seja adicionada
from main import sio

router = APIRouter()

@router.post("/create_usuario/", response_model=int)
def create_usuario(usuario: schemas_usuario.Usuario, db: Session = Depends(get_db)):
    """
    Cria uma usuario.
    """
    response_envio = crud_usuario.create_usuario(db=db, usuario=usuario)
     
    return response_envio

@router.post("/login_usuario/", response_model=str)
def login_usuario(usuario: schemas_usuario.LoginUsuario, db: Session = Depends(get_db)):
    """
    Realiza o login e retorna o token e payload do jwt
    """
    response_envio = crud_usuario.login_usuario(db=db, usuario=usuario)
     
    return response_envio