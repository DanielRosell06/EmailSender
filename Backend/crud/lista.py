# crud/lista.py

from sqlalchemy.orm import Session
from sqlalchemy import func, case
import models # Acessa a pasta acima para importar models.py
from schema import lista as schemas_lista # Acessa a pasta acima para importar schemas/lista.py

def create_lista(user_id: int, db: Session, lista: schemas_lista.ListaCreate):
    db_lista = models.Lista(
        Titulo=lista.Titulo,
        IdUsuario=user_id
    )    
    db.add(db_lista)
    db.commit()
    db.refresh(db_lista)
    return db_lista

def get_all_lista(user_id: int, db: Session):
    return db.query(models.Lista.IdLista, models.Lista.Titulo, models.Lista.Lixeira, models.Lista.Ultimo_Uso).filter(models.Lista.IdUsuario == user_id).all()

def get_all_lista_com_contagem_de_verificacao(user_id: int, db: Session):
    res = db.query(
        models.Lista.IdLista,
        models.Lista.Titulo,
        models.Lista.Ultimo_Uso,
        func.count(models.Email.IdEmail).label('TotalEmails'),
        func.count(case((models.Email.Verificacao == 1, models.Email.IdEmail))).label('EmailsVerificados'),
        func.count(case((models.Email.Verificacao == 0, models.Email.IdEmail))).label('EmailsNaoVerificados'),
        func.count(case((models.Email.Verificacao == -1, models.Email.IdEmail))).label('EmailsInvalidos')
    ).filter(
        models.Lista.IdUsuario == user_id,
        models.Lista.Lixeira == False
    ).join(
        models.Email,
        models.Email.Lista == models.Lista.IdLista
    ).group_by(
        models.Lista.IdLista,
        models.Lista.Titulo,
        models.Lista.Ultimo_Uso
    )
    return res

def get_lista_com_emails(user_id: int, db: Session, id_lista: int):
    lista = db.query(models.Lista).filter(models.Lista.IdLista == id_lista, models.Lista.IdUsuario == user_id).first()

    emails = db.query(models.Email).filter(models.Email.Lista == id_lista).all()
    resultado = {
        "IdLista": lista.IdLista,
        "Titulo": lista.Titulo,
        "Ultimo_Uso": lista.Ultimo_Uso,
        "Emails": emails
    }
    return resultado

def edit_lista(db: Session, id_lista: int, new_titulo: str):
    lista = db.query(models.Lista).filter(models.Lista.IdLista == id_lista).first()

    lista.Titulo = new_titulo

    db.add(lista)
    db.commit()
    db.refresh(lista)

    return new_titulo

def delete_lista(user_id: int,db: Session, id_lista: int):
    lista = db.query(models.Lista).filter(models.Lista.IdLista == id_lista, models.Lista.IdUsuario == user_id).first()
    if lista:
        lista.Lixeira = True
        db.add(lista)
        db.commit()
        return True
    return False

def undelete_lista(user_id: int, db: Session, id_lista: int):
    lista = db.query(models.Lista).filter(models.Lista.IdLista == id_lista, models.Lista.IdUsuario == user_id).first()
    if lista:
        lista.Lixeira = False
        db.add(lista)
        db.commit()
        return True
    return False