from cryptography.fernet import Fernet
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

import models
from schema import usuario_smtp as schema_usuario_smtp

# 1. Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

key_string = os.getenv("SMTP_KEY")

f = Fernet(key_string.encode())

def encrypt_password(password: str) -> str:
    encrypted_password = f.encrypt(password.encode())
    return encrypted_password.decode()


def decrypt_password(encrypted_password: str) -> str:
    decrypted_password = f.decrypt(encrypted_password.encode())

    return decrypted_password.decode()


def create_user_smtp(db: Session, new_usuario_smtp: schema_usuario_smtp.UsuarioSmtp):
    encrypted_password = encrypt_password(new_usuario_smtp.Senha)
    usuario = models.UsuarioSmtp(
        Usuario=new_usuario_smtp.Usuario,
        Senha=encrypted_password, # Salva a senha encriptada
        Dominio=new_usuario_smtp.Dominio,
        Porta=new_usuario_smtp.Porta,
    )
    
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario