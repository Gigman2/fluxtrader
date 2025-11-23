"""
Example demonstrating how to use database_handler.py with Base.

This file shows:
1. How Base is defined in database_handler.py
2. How to create models that inherit from Base
3. How to initialize the database
4. How to use database sessions
5. FastAPI integration pattern
"""

from config.database_handler import Base, DatabaseConnectionHandler
from models.channel import Channel  # Import model to register it with Base


def example_base_metadata():
    """Demonstrate how Base.metadata works."""
    print("=" * 70)
    print("Example 1: Understanding Base.metadata")
    print("=" * 70)
    
    # After importing Channel, Base.metadata contains the table definition
    print(f"\nBase is defined in: config.database_handler")
    print(f"Base.metadata contains {len(Base.metadata.tables)} table(s):")
    for table_name in Base.metadata.tables.keys():
        print(f"  - {table_name}")
    
    # Show the Channel table structure
    if 'channels' in Base.metadata.tables:
        channels_table = Base.metadata.tables['channels']
        print(f"\nChannels table columns:")
        for column in channels_table.columns:
            print(f"  - {column.name}: {column.type}")


def example_init_database():
    """Demonstrate how to initialize database using database_handler."""
    print("\n" + "=" * 70)
    print("Example 2: Initializing Database")
    print("=" * 70)
    
    # Create database handler - Base is automatically available!
    # No need to pass base=Base since Base is defined in database_handler.py
    db_handler = DatabaseConnectionHandler()
    
    # Initialize database - creates all tables
    print("\nCreating database tables...")
    print("Note: Base is automatically used from database_handler.py")
    try:
        db_handler.init_db()  # Uses Base automatically
        print("✓ Database tables created successfully!")
    except Exception as e:
        print(f"✗ Error: {e}")


def example_using_session():
    """Demonstrate how to use database session."""
    print("\n" + "=" * 70)
    print("Example 3: Using Database Session")
    print("=" * 70)
    
    db_handler = DatabaseConnectionHandler()
    
    # Get a database session using the generator pattern
    print("\nCreating a new channel...")
    try:
        # Use the get_db() generator
        db_gen = db_handler.get_db()
        db = next(db_gen)  # Get the session
        
        # Create a new channel
        new_channel = Channel(
            name="Crypto Signals Pro",
            description="Premium crypto trading signals",
            telegram_channel_id="@cryptosignalspro",
            is_active=True
        )
        
        # Add to session
        db.add(new_channel)
        db.commit()
        
        print(f"✓ Created channel: {new_channel}")
        
        # Query channels
        channels = db.query(Channel).all()
        print(f"\nTotal channels in database: {len(channels)}")
        for channel in channels:
            print(f"  - {channel}")
        
        # Close the session (normally handled by finally block)
        db.close()
        
    except Exception as e:
        print(f"✗ Error: {e}")
        if 'db' in locals():
            db.rollback()
            db.close()


def example_fastapi_usage():
    """Example of how to use in FastAPI."""
    print("\n" + "=" * 70)
    print("Example 4: FastAPI Usage Pattern")
    print("=" * 70)
    
    example_code = '''
# In your FastAPI app (main.py or routes):

from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from config.database_handler import Base, DatabaseConnectionHandler
from models.channel import Channel

app = FastAPI()

# Initialize handler once - Base is already in database_handler
db_handler = DatabaseConnectionHandler()

# Initialize database on startup
@app.on_event("startup")
async def startup():
    # Import models to register them with Base.metadata
    from models import Channel  # This registers Channel with Base
    
    # Create all tables
    db_handler.init_db()  # Uses Base from database_handler automatically

# Use in routes
@app.get("/channels")
def get_channels(db: Session = Depends(db_handler.get_db)):
    """Get all channels."""
    return db.query(Channel).all()

@app.post("/channels")
def create_channel(channel_data: dict, db: Session = Depends(db_handler.get_db)):
    """Create a new channel."""
    channel = Channel(**channel_data)
    db.add(channel)
    db.commit()
    db.refresh(channel)
    return channel

@app.get("/channels/{channel_id}")
def get_channel(channel_id: str, db: Session = Depends(db_handler.get_db)):
    """Get a specific channel."""
    return db.query(Channel).filter(Channel.id == channel_id).first()
'''
    print(example_code)


def example_model_definition():
    """Show how to define models using Base."""
    print("\n" + "=" * 70)
    print("Example 5: Defining Models")
    print("=" * 70)
    
    example_code = '''
# In models/your_model.py:

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from config.database_handler import Base  # Import Base from database_handler

class YourModel(Base):
    """
    Your model description.
    
    All models inherit from Base, which is defined in database_handler.py
    """
    __tablename__ = "your_table_name"
    
    # Primary key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    
    # Other columns
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False)
    
    def __repr__(self):
        return f"<YourModel(id={self.id}, name='{self.name}')>"
'''
    print(example_code)


def example_complete_workflow():
    """Show complete workflow from model definition to usage."""
    print("\n" + "=" * 70)
    print("Example 6: Complete Workflow")
    print("=" * 70)
    
    workflow = '''
Complete workflow:

1. Define Base (already done in database_handler.py)
   └─ Base = declarative_base()

2. Create models inheriting from Base
   └─ models/channel.py: class Channel(Base): ...

3. Import models to register with Base.metadata
   └─ from models.channel import Channel

4. Initialize database handler
   └─ db_handler = DatabaseConnectionHandler()

5. Create tables
   └─ db_handler.init_db()  # Uses Base automatically

6. Use sessions to interact with database
   └─ db = next(db_handler.get_db())
   └─ db.query(Channel).all()
'''
    print(workflow)


if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("SignalFlux Database Handler Examples")
    print("=" * 70)
    
    # Example 1: Show Base.metadata
    example_base_metadata()
    
    # Example 2: Initialize database
    example_init_database()
    
    # Example 3: Use session
    example_using_session()
    
    # Example 4: FastAPI pattern
    example_fastapi_usage()
    
    # Example 5: Model definition
    example_model_definition()
    
    # Example 6: Complete workflow
    example_complete_workflow()
    
    print("\n" + "=" * 70)
    print("Examples complete!")
    print("=" * 70)
    print("\nKey Points:")
    print("  ✓ Base is defined in config/database_handler.py")
    print("  ✓ No need to pass base=Base - it's automatic")
    print("  ✓ Import Base from config.database_handler")
    print("  ✓ All models inherit from the same Base")
    print("  ✓ Base.metadata contains all table definitions")

