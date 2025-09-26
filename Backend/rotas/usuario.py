# rotas/usuario.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from jwt_auth import verificar_token
from schema import usuario as schemas_usuario
from crud import usuario as crud_usuario

# Importa a instância global do SocketIO do main.py
# É crucial que essa linha seja adicionada
from main import sio

router = APIRouter()

@router.post("/create_usuario", response_model=int)
def create_usuario(usuario: schemas_usuario.Usuario, db: Session = Depends(get_db)):
    """
    Cria uma usuario.
    """
    response_envio = crud_usuario.create_usuario(db=db, usuario=usuario)
     
    return response_envio


@router.post("/login_usuario", response_model=str)
def login_usuario(usuario: schemas_usuario.LoginUsuario, db: Session = Depends(get_db)):
    """
    Realiza o login e retorna o token e payload do jwt
    """
    response_envio = crud_usuario.login_usuario(db=db, usuario=usuario)
     
    return response_envio


@router.get("/verifica_token")
def verificar_autenticacao(user_id: int = Depends(verificar_token), db: Session = Depends(get_db)):
    """
    Verifica se o usuário está autenticado e com um token válido.
    """
    # Procura o usuário no banco de dados com base no ID do token
    db_usuario = crud_usuario.get_usuario_by_id(db, user_id)

    # Se o usuário não for encontrado (ID inválido), retorna 401
    if not db_usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

    # Se o usuário for encontrado, retorna uma mensagem de sucesso
    return {"status": "ok", "message": "Token é válido."}

@router.get("/get_dados_usuario_by_token", response_model=schemas_usuario.UsuarioSemSenha)
def verificar_autenticacao(user_id: int = Depends(verificar_token), db: Session = Depends(get_db)):
    """
    Verifica se o usuário está autenticado e com um token válido.
    """
    # Procura o usuário no banco de dados com base no ID do token
    db_usuario = crud_usuario.get_usuario_by_id(db, user_id)

    # Se o usuário não for encontrado (ID inválido), retorna 401
    if not db_usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

    # Se o usuário for encontrado, retorna uma mensagem de sucesso
    return db_usuario