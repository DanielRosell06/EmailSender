# rotas/envio.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
import io

from schema import envio as schemas_envio

from crud import envio as crud_envio

router = APIRouter()

@router.get("/get_all_envio_com_lista_campanha_detalhe", response_model=list[schemas_envio.Envio])
def read_envios(db: Session = Depends(get_db)):
    response_envios = crud_envio.get_all_envio_com_lista_campanha_detalhe(db)

    return response_envios

@router.post("/envio/", response_model=schemas_envio.EnvioCreate)
def create_envio(envio_data: schemas_envio.EnvioCreate, db: Session = Depends(get_db)):
    """
    Cria um envio e realiza o envio dos emails atraves de uma Lista e uma Campanha.
    """
    response_envio = crud_envio.create_envio(db=db, envio=envio_data)
     
    return response_envio
