"""template management

Revision ID: ad4a0dea6758
Revises: e5426f92c5b0
Create Date: 2025-11-23 23:10:34.730343

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ad4a0dea6758'
down_revision: Union[str, None] = 'e5426f92c5b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create templates table
    op.create_table('templates',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('channel_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('version', sa.Integer(), nullable=False),
    sa.Column('extraction_config', postgresql.JSON(astext_type=sa.Text()), nullable=False),
    sa.Column('test_message', sa.Text(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('extraction_success_rate', sa.Integer(), nullable=False),
    sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True),
    sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Create extraction_history table
    # Note: signal_id foreign key will be added later when signals table exists
    op.create_table('extraction_history',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('template_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('signal_id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('was_successful', sa.Boolean(), nullable=False),
    sa.Column('error_message', sa.Text(), nullable=True),
    sa.Column('extracted_data', postgresql.JSON(astext_type=sa.Text()), nullable=True),
    sa.Column('original_message', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['template_id'], ['templates.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    
    # Add foreign key constraint for signal_id if signals table exists
    # This will be added in a later migration when signals table is created
    # For now, we'll create the table without the foreign key constraint
    
    # Drop description column from channels (if it exists)
    try:
        op.drop_column('channels', 'description')
    except Exception:
        # Column might not exist, ignore
        pass


def downgrade() -> None:
    # Drop extraction_history table
    op.drop_table('extraction_history')
    
    # Drop templates table
    op.drop_table('templates')
    
    # Re-add description column to channels (if needed)
    try:
        op.add_column('channels', sa.Column('description', sa.TEXT(), autoincrement=False, nullable=True))
    except Exception:
        # Column might already exist, ignore
        pass
