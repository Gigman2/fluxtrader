"""
Script to check for duplicate emails in the accounts table.
Run this before applying the unique constraint migration.
"""

from config.database_handler import DatabaseConnectionHandler
from sqlalchemy import text

def check_duplicate_emails():
    """Check for duplicate emails in the accounts table."""
    db_handler = DatabaseConnectionHandler()
    engine = db_handler.get_engine()
    
    with engine.connect() as conn:
        # Check for duplicate emails
        query = text("""
            SELECT email, COUNT(*) as count
            FROM accounts
            WHERE email IS NOT NULL
            GROUP BY email
            HAVING COUNT(*) > 1
        """)
        
        result = conn.execute(query)
        duplicates = result.fetchall()
        
        if duplicates:
            print(f"⚠️  Found {len(duplicates)} duplicate email(s):")
            print("-" * 60)
            for email, count in duplicates:
                print(f"  Email: {email} - appears {count} time(s)")
            
            # Get all accounts with duplicate emails
            print("\n📋 Accounts with duplicate emails:")
            print("-" * 60)
            for email, _ in duplicates:
                accounts_query = text("""
                    SELECT id, username, email, created_at
                    FROM accounts
                    WHERE email = :email
                    ORDER BY created_at
                """)
                accounts = conn.execute(accounts_query, {"email": email}).fetchall()
                for account in accounts:
                    print(f"  ID: {account[0]}, Username: {account[1]}, Email: {account[2]}, Created: {account[3]}")
            
            return False
        else:
            print("✅ No duplicate emails found. Safe to add unique constraint.")
            return True

if __name__ == "__main__":
    try:
        is_safe = check_duplicate_emails()
        exit(0 if is_safe else 1)
    except Exception as e:
        print(f"❌ Error checking duplicates: {e}")
        exit(1)

