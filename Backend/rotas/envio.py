# rotas/envio.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schema import envio as schemas_envio
from crud import envio as crud_envio
from jwt_auth import verificar_token

# Importa a instância global do SocketIO do main.py
# É crucial que essa linha seja adicionada
from main import sio

router = APIRouter()

# Define a instância do SocketIO na função do CRUD
crud_envio.set_socketio_server(sio)

@router.get("/get_all_envio_com_lista_campanha_detalhe", response_model=list[schemas_envio.Envio])
def read_envios(db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    response_envios = crud_envio.get_all_envio_com_lista_campanha_detalhe(user_id=user_id, db=db)
    return response_envios

@router.post("/envio", response_model=schemas_envio.EnvioCreate)
def create_envio(envio_data: schemas_envio.EnvioCreate, db: Session = Depends(get_db), user_id: int = Depends(verificar_token)):
    """
    Cria um envio e realiza o envio dos emails atraves de uma Lista e uma Campanha.
    """
    response_envio = crud_envio.create_envio(user_id=user_id, db=db, envio=envio_data)
     
    return response_envio


@sio.on('start_envio')
async def start_envio(sid: str, data: dict):
    try:
        db = next(get_db())
        
        token = data.get("token")
        if not token:
            await sio.emit('envio_error', {'message': 'Token de autenticação não fornecido.'}, room=sid)
            return

        try:
            user_id = verificar_token(token)
        except Exception:
            await sio.emit('envio_error', {'message': 'Token de autenticação inválido ou expirado.'}, room=sid)
            return

        envio_data = schemas_envio.EnvioCreate(**data)
        
        await crud_envio.create_envio(user_id=user_id, db=db, envio=envio_data, sid=sid)
        
    except Exception as e:
        print(f"Erro ao iniciar o envio: {e}")
        await sio.emit('envio_error', {'message': str(e)}, room=sid)