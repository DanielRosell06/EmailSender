# /jwt_auth.py

import jwt
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
from fastapi import Header, HTTPException, status
import os
from dotenv import load_dotenv

load_dotenv()
USER_KEY = os.getenv("USER_KEY")

def verificar_token(authorization: str = Header(..., alias="Authorization")):
    """
    Função de dependência do FastAPI para verificar um token JWT.
    É usada em rotas protegidas.
    """

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação ausente ou inválido"
        )

    token = authorization.split(" ")[1] # Pega a string do token

    print(f"Header de Autorização recebido: '{authorization}'")

    try:
        # Decodifica o token para extrair o payload
        payload = jwt.decode(token, USER_KEY.encode(), algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: ID do usuário não encontrado"
            )
        
        return user_id # Retorna o ID do usuário para a rota
    
    except jwt.InvalidTokenError as e:
        # Captura todos os erros específicos do JWT
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}"
        )
        
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação expirado"
        )
        
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação inválido"
        )

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Erro de autenticação"
        )