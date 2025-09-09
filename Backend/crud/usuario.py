#crud/usuario

from sqlalchemy.orm import Session
import os
import jwt
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import models # Acessa a pasta acima para importar models.py
from schema import usuario as schema_usuario # Acessa a pasta acima para importar schemas/lista.py
import bcrypt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv


load_dotenv()

USER_KEY = os.getenv("USER_KEY")

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
        
        return 1

    except IntegrityError as e:
        # Erro específico para violação de integridade (e-mail duplicado, por exemplo)
        db.rollback()
        print(f"Erro de integridade (e-mail já cadastrado?): {e}")
        return 2  # 2: E-mail já cadastrado

    except SQLAlchemyError as e:
        # Trata qualquer outro erro no banco de dados
        db.rollback()
        print(f"Erro no banco de dados: {e}")
        return 3  # 3: Erro no banco de dados

    except Exception as e:
        # Trata outros erros gerais do servidor
        print(f"Ocorreu um erro inesperado no servidor: {e}")
        return 4  # 4: Erro no servidor
    
def login_usuario(db: Session, usuario: schema_usuario.LoginUsuario):
    try:
        db_usuario = db.query(
            models.Usuario).filter(
            models.Usuario.Email == usuario.Email).first()
        
        if not db_usuario:
            return "1"  # 1: Usuário não encontrado
        
        if bcrypt.checkpw(usuario.Senha.encode('utf-8'), db_usuario.Senha):
            expire = datetime.now(timezone.utc) + timedelta(days=3)
            to_encode = {"sub": db_usuario.IdUsuario, "exp": expire}

            encoded_jwt = jwt.encode(to_encode, USER_KEY, algorithm="HS256")
            return encoded_jwt
        else:
            return "2" # 2: Senha incorreta
        
    except Exception as e:
        # Trata outros erros gerais do servidor
        print(f"Ocorreu um erro inesperado no servidor: {e}")
        return "3"  # 3: Erro no servidor