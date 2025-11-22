# Database Migrations Guide

## Overview

**Alembic** is SQLAlchemy's database migration tool. It allows you to:
- Track database schema changes over time
- Create versioned migrations
- Apply/rollback migrations safely
- Keep database schema in sync across environments

## Why Migrations Instead of `create_all()`?

**Current approach (create_all):**
```python
db_handler.init_db()  # Creates all tables, but:
# ❌ Can't modify existing tables
# ❌ Can't track changes
# ❌ Can't rollback
# ❌ Loses data if you drop/recreate
```

**Migrations approach:**
```python
alembic upgrade head  # Applies migrations incrementally:
# ✅ Can modify existing tables
# ✅ Tracks all changes
# ✅ Can rollback to previous versions
# ✅ Preserves data
# ✅ Works across dev/staging/production
```

## Setup Structure

```
FluxTrader/
├── alembic/              # Migration scripts (auto-generated)
│   ├── versions/         # Individual migration files
│   │   ├── 001_initial_schema.py
│   │   ├── 002_add_user_email.py
│   │   └── ...
│   ├── env.py           # Alembic configuration
│   └── script.py.mako   # Migration template
├── alembic.ini          # Alembic config file
├── config/
│   └── database_handler.py  # Your Base is here
└── models/
    └── channel.py       # Your models
```

## Installation

```bash
pip install alembic
```

Add to `requirements.txt`:
```
alembic
```

## Configuration Steps

### 1. Initialize Alembic
```bash
cd FluxTrader
alembic init alembic
```

This creates:
- `alembic/` directory with migration scripts
- `alembic.ini` configuration file

### 2. Configure `alembic.ini`

```ini
# alembic.ini
[alembic]
script_location = alembic
sqlalchemy.url = driver://user:pass@localhost/dbname

# You'll need to update sqlalchemy.url to use your env variables
```

### 3. Configure `alembic/env.py`

This is the key file that connects Alembic to your Base:

```python
# alembic/env.py
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import your Base and models
from config.database_handler import Base
from models.channel import Channel  # Import all models to register them

# This is the MetaData object Alembic uses
target_metadata = Base.metadata

# Get database URL from your env_handler
from config.env_handler import EnvHandler
env_handler = EnvHandler()
config = context.config
config.set_main_option('sqlalchemy.url', env_handler.get_database_url())

# ... rest of Alembic setup code
```

## Workflow

### Initial Migration (Create tables from existing models)

```bash
# 1. Create initial migration
alembic revision --autogenerate -m "Initial schema"

# This creates: alembic/versions/001_initial_schema.py
# It detects all tables from Base.metadata

# 2. Review the migration file
# Check alembic/versions/001_initial_schema.py
# Make sure it looks correct

# 3. Apply the migration
alembic upgrade head
```

### Adding New Models or Columns

```python
# 1. Modify your model
# models/signal.py
class Signal(Base):
    __tablename__ = "signals"
    id = Column(UUID, primary_key=True)
    symbol = Column(String(50))
    # Add new column
    volume = Column(Integer)  # ← New field

# 2. Create migration
alembic revision --autogenerate -m "Add volume to signals"

# 3. Review migration
# Check the generated migration file

# 4. Apply migration
alembic upgrade head
```

### Manual Migrations (Complex Changes)

```bash
# Create empty migration
alembic revision -m "Rename column"

# Edit the migration file manually
# alembic/versions/xxx_rename_column.py
def upgrade():
    op.rename_column('channels', 'old_name', 'new_name')

def downgrade():
    op.rename_column('channels', 'new_name', 'old_name')

# Apply
alembic upgrade head
```

## Integration with Your Current Setup

### Option 1: Keep `init_db()` for Development

```python
# config/database_handler.py
def init_db(self, base=None):
    """Initialize database - use for development only."""
    # Still works, but migrations are preferred for production
    base_to_use = base or self._base or Base
    base_to_use.metadata.create_all(bind=self.get_engine())
```

**Usage:**
- Development: `db_handler.init_db()` (quick, but loses data)
- Production: `alembic upgrade head` (safe, preserves data)

### Option 2: Replace `init_db()` with Migration Check

```python
# config/database_handler.py
def init_db(self, base=None):
    """Initialize database using Alembic migrations."""
    import subprocess
    result = subprocess.run(['alembic', 'upgrade', 'head'], 
                          capture_output=True, text=True)
    if result.returncode != 0:
        raise DatabaseError(f"Migration failed: {result.stderr}")
```

## Common Commands

```bash
# Create a new migration (auto-detect changes)
alembic revision --autogenerate -m "Description"

# Create empty migration (manual)
alembic revision -m "Description"

# Apply all pending migrations
alembic upgrade head

# Apply specific migration
alembic upgrade <revision_id>

# Rollback one migration
alembic downgrade -1

# Rollback to specific version
alembic downgrade <revision_id>

# Show current revision
alembic current

# Show migration history
alembic history

# Show pending migrations
alembic heads
```

## Migration File Structure

```python
# alembic/versions/001_initial_schema.py
"""Initial schema

Revision ID: 001
Revises: 
Create Date: 2025-01-01 12:00:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # Create channels table
    op.create_table(
        'channels',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('telegram_channel_id', sa.String(100), nullable=False),
        # ... more columns
    )
    op.create_index('ix_channels_name', 'channels', ['name'])

def downgrade():
    # Rollback: drop the table
    op.drop_index('ix_channels_name', 'channels')
    op.drop_table('channels')
```

## Best Practices

1. **Always review auto-generated migrations** before applying
2. **Test migrations** on a copy of production data
3. **Never edit applied migrations** - create new ones instead
4. **Use descriptive migration messages**: `"Add user email column"` not `"Update"`
5. **Keep migrations small** - one logical change per migration
6. **Version control migrations** - commit them to git
7. **Run migrations in CI/CD** before deployment

## Integration with Flask App

```python
# app/__init__.py or main.py
from flask import Flask
from config.database_handler import DatabaseConnectionHandler

def create_app():
    app = Flask(__name__)
    
    # Initialize database handler
    db_handler = DatabaseConnectionHandler()
    
    # On startup, run migrations instead of create_all
    @app.before_first_request
    def init_database():
        import subprocess
        subprocess.run(['alembic', 'upgrade', 'head'])
    
    return app
```

## Environment-Specific Configuration

```python
# alembic/env.py
from config.env_handler import EnvHandler

env_handler = EnvHandler()

# Use different databases for different environments
if env_handler.get_env("APP_ENV") == "test":
    database_url = "sqlite:///test.db"
else:
    database_url = env_handler.get_database_url()

config.set_main_option('sqlalchemy.url', database_url)
```

## Summary

**Current State:**
- `Base` defined in `config/database_handler.py`
- Models inherit from `Base`
- `init_db()` creates all tables at once

**With Migrations:**
- Alembic tracks schema changes
- Each change is a versioned migration file
- Can apply/rollback changes incrementally
- Production-safe way to manage database schema

**Next Steps:**
1. Install Alembic: `pip install alembic`
2. Initialize: `alembic init alembic`
3. Configure `alembic/env.py` to use your `Base`
4. Create initial migration: `alembic revision --autogenerate -m "Initial schema"`
5. Apply: `alembic upgrade head`

