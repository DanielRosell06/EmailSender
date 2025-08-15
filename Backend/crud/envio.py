# crud/envio.py

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import envio as schemas_envio # Acessa a pasta acima para importar schemas/lista.py

def create_lista(db: Session, envio: schemas_envio.EnvioCreate):
    db_envio = models.Lista(Titulo=lista.Titulo)    
    db.add(db_lista)
    db.commit()
    db.refresh(db_lista)
    return db_lista