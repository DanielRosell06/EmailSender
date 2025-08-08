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