from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import dns.resolver
import re
import logging

from models import Email, Lista

router = APIRouter()
logger = logging.getLogger(__name__)

def validar_formato_email(email: str) -> bool:
    """Valida o formato básico do email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def verificar_mx_dominio(domain: str) -> bool:
    """Verifica se o domínio tem registros MX"""
    try:
        answers = dns.resolver.resolve(domain, 'MX')
        return len(answers) > 0
    except:
        return False

def verificar_email(email: str) -> bool:
    """Verifica um email individual"""
    # Valida formato
    if not validar_formato_email(email):
        return False
    
    # Extrai domínio e verifica MX
    domain = email.split('@')[1]
    return verificar_mx_dominio(domain)

def verificar_lista_emails(id_lista: int, db: Session, user_id: int):
    # Verifica se a lista existe e pertence ao usuário
    lista = db.query(Lista).filter(
        Lista.IdLista == id_lista,
        Lista.IdUsuario == user_id,
        Lista.Lixeira == False
    ).first()
    
    if not lista:
        raise HTTPException(status_code=404, detail="Lista não encontrada")
    
    # Busca emails não verificados
    emails_para_verificar = db.query(Email).filter(
        Email.Lista == id_lista,
        Email.Verificacao == 0  # 0 = não verificado
    ).all()
    
    if not emails_para_verificar:
        return True
    
    # Processa cada email
    for email in emails_para_verificar:
        try:
            valido = verificar_email(email.Conteudo)
            email.Verificacao = 1 if valido else -1
        except Exception as e:
            logger.error(f"Erro ao verificar email {email.Conteudo}: {str(e)}")
            # Marca como inválido em caso de erro
            email.Verificacao = -1
    
    # Salva no banco
    db.commit()
    
    return True