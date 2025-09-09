"""Trocando senha para LargeBinary

Revision ID: 91c6cb254351
Revises: b507c3b12844
Create Date: 2025-09-09 10:50:09.827427

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91c6cb254351'
down_revision: Union[str, Sequence[str], None] = 'b507c3b12844'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('usuario', 'Senha',
               existing_type=sa.VARCHAR(),
               type_=sa.LargeBinary(),
               existing_nullable=False,
               postgresql_using='"Senha"::bytea') # Corrigido aqui


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('usuario', 'Senha',
               existing_type=sa.LargeBinary(),
               type_=sa.VARCHAR(),
               existing_nullable=False,
               postgresql_using='"Senha"::varchar') # Corrigido aqui