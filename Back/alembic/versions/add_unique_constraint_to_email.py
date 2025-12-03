"""add unique constraint to email

Revision ID: a1b2c3d4e5f6
Revises: f17be418e772
Create Date: 2025-01-XX XX:XX:XX.XXXXXX

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'f17be418e772'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Add unique constraint to email column.
    
    This migration:
    1. Checks for duplicate emails
    2. Handles duplicates (keeps the oldest account, updates others)
    3. Adds the unique constraint
    """
    conn = op.get_bind()
    
    # Step 1: Check for duplicate emails
    duplicate_check = text("""
        SELECT email, COUNT(*) as count
        FROM accounts
        WHERE email IS NOT NULL
        GROUP BY email
        HAVING COUNT(*) > 1
    """)
    
    duplicates = conn.execute(duplicate_check).fetchall()
    
    if duplicates:
        print(f"\n⚠️  Found {len(duplicates)} duplicate email(s). Handling duplicates...")
        
        # Step 2: For each duplicate email, keep the oldest account and update others
        for email, count in duplicates:
            print(f"  Processing duplicate email: {email} ({count} occurrences)")
            
            # Get all accounts with this email, ordered by creation date
            accounts_query = text("""
                SELECT id, username, created_at
                FROM accounts
                WHERE email = :email
                ORDER BY created_at ASC
            """)
            accounts = conn.execute(accounts_query, {"email": email}).fetchall()
            
            if len(accounts) > 1:
                # Keep the first (oldest) account, update others
                keep_account_id = accounts[0][0]
                keep_username = accounts[0][1]
                
                print(f"    Keeping account: {keep_username} (ID: {keep_account_id})")
                
                # Update other accounts with a modified email
                for account_id, username, _ in accounts[1:]:
                    # Option 1: Append account ID to make it unique
                    new_email = f"{email.split('@')[0]}+{str(account_id)[:8]}@{email.split('@')[1]}"
                    
                    # Option 2: Set to NULL if email is nullable (not recommended if email is required)
                    # new_email = None
                    
                    # Option 3: Use username-based email
                    # new_email = f"{username}@migrated.local"
                    
                    update_query = text("""
                        UPDATE accounts
                        SET email = :new_email
                        WHERE id = :account_id
                    """)
                    conn.execute(update_query, {"new_email": new_email, "account_id": account_id})
                    print(f"    Updated account {username} (ID: {account_id}) email to: {new_email}")
        
        # Commit the changes
        conn.commit()
        print("✅ Duplicate emails handled.\n")
    
    # Step 3: Add unique constraint
    # First, ensure there are no NULL values if email is required
    # (Skip this if email can be NULL)
    null_check = text("SELECT COUNT(*) FROM accounts WHERE email IS NULL")
    null_count = conn.execute(null_check).scalar()
    
    if null_count > 0:
        raise Exception(
            f"Cannot add unique constraint: Found {null_count} accounts with NULL email. "
            "Please update NULL emails first or make email nullable."
        )
    
    # Add unique constraint
    try:
        op.create_unique_constraint('uq_accounts_email', 'accounts', ['email'])
        print("✅ Unique constraint added to email column")
    except Exception as e:
        # If constraint already exists, that's okay
        if 'already exists' in str(e).lower() or 'duplicate' in str(e).lower():
            print("⚠️  Unique constraint already exists on email column")
        else:
            raise


def downgrade() -> None:
    """Remove unique constraint from email column."""
    # Drop the unique constraint
    try:
        op.drop_constraint('uq_accounts_email', 'accounts', type_='unique')
        print("✅ Unique constraint removed from email column")
    except Exception as e:
        # If constraint doesn't exist, that's okay
        if 'does not exist' in str(e).lower():
            print("⚠️  Unique constraint does not exist on email column")
        else:
            raise

