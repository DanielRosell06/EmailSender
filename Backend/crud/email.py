# crud/email.py

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import email as schemas_email # Acessa a pasta acima para importar schemas/lista.py

def create_email(db: Session, emails: list[schemas_email.EmailCreate], lista_id: int):
    
    for i in emails:
        db_email = models.Email(Conteudo=i, Lista=lista_id)
        db.add(db_email)

    db.commit()
    db.refresh(db_email)
    return True

def create_email_sem_lista(db: Session, emails: list[str], lista_id: int):
    
    for email_data in emails:
        db_email = models.Email(Conteudo=email_data, Lista=lista_id)
        db.add(db_email)

    db.commit()
    db.refresh(db_email)
    return True

def edit_email(db: Session, emails: list[schemas_email.EmailEdit]):
    for email in emails:
        db_email = db.query(models.Email).filter(models.Email.IdEmail == email.IdEmail).first()
        db_email.Conteudo = email.Conteudo
        db.add(db_email)

    db.commit()
    return True

def delete_email(db: Session, email_ids: list[int]):
    print(f"Deletando: {email_ids}")
    # retorna False se lista vazia ou inválida
    if not email_ids:
        return False

    try:
        # normaliza/valida ids (remove duplicados e garante inteiros)
        ids = list({int(i) for i in email_ids})
    except (ValueError, TypeError):
        return False

    try:
        # deleta registros dependentes primeiro, depois os emails
        db.query(models.Detalhe).filter(models.Detalhe.Email.in_(ids)).delete(synchronize_session=False)
        db.query(models.StatusEnvio).filter(models.StatusEnvio.IdEmail.in_(ids)).delete(synchronize_session=False)
        db.query(models.Email).filter(models.Email.IdEmail.in_(ids)).delete(synchronize_session=False)
        db.commit()
        return True
    except Exception as e:
        print(e)
        db.rollback()
        return False