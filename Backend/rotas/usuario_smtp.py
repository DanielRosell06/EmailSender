# rotas/user_smtp.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from jwt_auth import verificar_token


from schema import usuario_smtp as schema_usuario_smtp

from crud import usuario_smtp as crud_usuario_smtp

# Importa a instância global do SocketIO do main.py
# É crucial que essa linha seja adicionada
from main import sio

router = APIRouter()

@router.post("/create_user_smtp/", response_model=schema_usuario_smtp.UsuarioSmtp)
def create_user_smtp(user_smtp: schema_usuario_smtp.UsuarioSmtp, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Cria um create_user_smtp
    """
    response = crud_usuario_smtp.create_user_smtp(user_id=user_id, db=db, new_usuario_smtp=user_smtp)
     
    return response

@router.get("/get_all_user_smtp/", response_model=list[schema_usuario_smtp.UsuarioSmtpComIdUsuarioSmtpSemSenha])
def get_all_user_smtp(db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Pega todos os UserSmtp sem a senha
    """
    response = crud_usuario_smtp.get_user_smtp_sem_senha(user_id=user_id, db=db)
     
    return response

@router.get("/get_user_password/", response_model=str)
def get_all_user_smtp(id_user_smtp: int, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Pega a senha descriptografada do usuario 
    """
    response = crud_usuario_smtp.get_user_smtp_senha(user_id=user_id, id_user_smtp=id_user_smtp, db=db)
     
    return response