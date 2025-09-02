# crud/lista.py

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import lista as schemas_lista # Acessa a pasta acima para importar schemas/lista.py

def create_lista(db: Session, lista: schemas_lista.ListaCreate):
    db_lista = models.Lista(Titulo=lista.Titulo)    
    db.add(db_lista)
    db.commit()
    db.refresh(db_lista)
    return db_lista

def get_all_lista(db: Session):
    return db.query(models.Lista.IdLista, models.Lista.Titulo, models.Lista.Lixeira, models.Lista.Ultimo_Uso).all()

def get_lista_com_emails(db: Session, id_lista: int):
    lista = db.query(models.Lista).filter(models.Lista.IdLista == id_lista).first()

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

def delete_lista(db: Session, id_lista: int):
    lista = db.query(models.Lista).filter(models.Lista.IdLista == id_lista).first()
    if lista:
        lista.Lixeira = True
        db.add(lista)
        db.commit()
        return True
    return False

def undelete_lista(db: Session, id_lista: int):
    lista = db.query(models.Lista).filter(models.Lista.IdLista == id_lista).first()
    if lista:
        lista.Lixeira = False
        db.add(lista)
        db.commit()
        return True
    return False