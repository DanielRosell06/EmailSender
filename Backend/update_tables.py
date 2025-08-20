# standalone_update.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect

# AQUI: Importamos a Base e os modelos.
# Isso garante que a metadata do SQLAlchemy tenha a estrutura completa das tabelas.
from database import Base
import models

# --- Configuração Inicial ---
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("A variável de ambiente DATABASE_URL não foi definida.")

# Cria a engine do SQLAlchemy e o inspector
engine = create_engine(DATABASE_URL)
inspector = inspect(engine)

# --- Funções de Atualização e Verificação ---
def create_tables_if_not_exist():
    """
    Verifica e cria as tabelas do banco de dados que não existem,
    usando a metadata da Base do SQLAlchemy.
    """
    print("Iniciando a verificação e criação das tabelas...")
    
    try:
        # Pega a metadata da Base, que contém a estrutura de todas as tabelas
        metadata = Base.metadata
        
        # Cria as tabelas que ainda não existem no banco de dados.
        # Ele faz isso de forma segura, sem apagar dados.
        metadata.create_all(bind=engine)
        
        print("\nTodas as tabelas foram verificadas. Novas tabelas criadas com sucesso!")
            
    except Exception as e:
        print(f"\nErro ao criar tabelas: {e}")
        raise

def verify_all_tables():
    """Verifica a estrutura final de todas as tabelas e a exibe no console."""
    print("\n" + "="*40)
    print("--- Estrutura Final do Banco de Dados ---")
    print("="*40)
    
    try:
        for table_name in inspector.get_table_names():
            print(f"\n### Tabela: {table_name}")
            
            print("  - Colunas:")
            columns = inspector.get_columns(table_name)
            for col in columns:
                nullable = "NULL" if col['nullable'] else "NOT NULL"
                # Usa .get() para evitar KeyError em versões antigas do SQLAlchemy
                pk_info = " (PK)" if col.get('primary_key', False) else ""
                print(f"    - {col['name']}: {col['type']} ({nullable}){pk_info}")
                
            foreign_keys = inspector.get_foreign_keys(table_name)
            if foreign_keys:
                print("  - Chaves Estrangeiras (Foreign Keys):")
                for fk in foreign_keys:
                    print(f"    - {fk['constrained_columns']} → {fk['referred_table']}.{fk['referred_columns']}")
            
            print("-" * 20)

    except Exception as e:
        print(f"\nErro ao verificar as tabelas: {e}")
        raise

# --- Execução do Script ---
if __name__ == "__main__":
    create_tables_if_not_exist()
    verify_all_tables()