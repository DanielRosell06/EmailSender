# rotas/envio.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session

from schema import envio as schemas_envio

from crud import envio as crud_envio

router = APIRouter()

@router.post("/envio/", response_model=schemas_envio.Envio)
def create_envio(envio_data: schemas_envio.EnvioCreate, db: Session = Depends(get_db)):
    """
    Cria um envio e realiza o envio dos emails atraves de uma Lista e uma Campanha.
    """
    response_envio = crud_envio.create_envio(db=db, envio=envio_data)
     
    return response_envio