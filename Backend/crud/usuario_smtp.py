#crud/usuario_smtp

from sqlalchemy.orm import Session
import models # Acessa a pasta acima para importar models.py
from schema import usuario_smtp as schema_usuario_smtp

def create_user_smtp(db: Session, new_usuario_smtp: schema_usuario_smtp.UsuarioSmtp):
    usuario = models.UsuarioSmtp(
        Usuario = new_usuario_smtp.Usuario,
        Senha = new_usuario_smtp.Senha,
        Dominio = new_usuario_smtp.Dominio,
        Porta = new_usuario_smtp.Porta,
    )    
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario