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

def edit_email(db: Session, emails: list[schemas_email.EmailEdit]):
    for email in emails:
        db_email = db.query(models.Email).filter(models.Email.IdEmail == email.IdEmail).first()
        db_email.Conteudo = email.Conteudo
        db.add(db_email)

    db.commit()
    return True

def delete_email(db: Session, email_ids: list[int]):
    try:
        num_deleted = db.query(models.Email).filter(models.Email.IdEmail.in_(email_ids)).delete(synchronize_session=False)
        db.commit()
        return True
    except Exception as e:
        db.rollback()  # Em caso de erro, desfaz as operações para evitar inconsistências
        return False