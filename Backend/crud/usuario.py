#crud/usuario

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import models # Acessa a pasta acima para importar models.py
from schema import usuario as schema_usuario # Acessa a pasta acima para importar schemas/lista.py
import bcrypt

def create_usuario(db: Session, usuario: schema_usuario.Usuario):
    try:
        hashed_senha = bcrypt.hashpw(usuario.Senha.encode('utf-8'), bcrypt.gensalt())

        db_usuario = models.Usuario(
            Nome=usuario.Nome,
            Email=usuario.Email,
            Senha=hashed_senha
        )    
        db.add(db_usuario)
        db.commit()
        db.refresh(db_usuario)
        return True

    except SQLAlchemyError as e:
            # Em caso de qualquer erro no banco de dados, desfaz a transação
            db.rollback()
            print(f"Erro ao criar usuário: {e}")
            return False
        
    except Exception as e:
        # Trata outros erros gerais que podem acontecer (ex: na biblioteca bcrypt)
        print(f"Ocorreu um erro inesperado: {e}")
        return False