# crud/email.py

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import email as schemas_email # Acessa a pasta acima para importar schemas/lista.py

def create_email(db: Session, email: list[schemas_email.EmailCreate], lista_id: int):
    
    for i in email:
        db_email = models.Email(Conteudo=i, Lista=lista_id)
        db.add(db_email)

    db.commit()
    db.refresh(db_email)
    return db_email