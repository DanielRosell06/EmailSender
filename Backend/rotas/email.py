# rotas/lista.py
from fastapi import APIRouter, Depends
from database import engine, Base, get_db
from sqlalchemy.orm import Session
import models

from schema import email as schemas_email

from crud import email as crud_email

router = APIRouter()

@router.put("/edit_email/", response_model=bool)
def edit_email(emails: list[schemas_email.EmailEdit], db: Session = Depends(get_db)):
    """
    Edita o conteudo dos emails fornecidos
    """
    response = crud_email.edit_email(db=db, emails=emails)
     
    return response

@router.delete("/delete_email/", response_model=bool)
def delete_email(email_ids: list[int], db: Session = Depends(get_db)):
    """
    Remove os emails fornecidos
    """
    response = crud_email.delete_email(db=db, email_ids=email_ids)
     
    return response