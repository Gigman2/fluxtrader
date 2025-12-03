# Adding Unique Constraints to Existing Database Columns

## Problem

You want to add a `unique=True` constraint to a column that already has data, potentially including duplicates.

## Solution Steps

### 1. Check for Duplicates First

Before running the migration, check for duplicate values:

```bash
# Using the provided script
python scripts/check_duplicate_emails.py

# Or manually query the database
python -c "
from config.database_handler import DatabaseConnectionHandler
from sqlalchemy import text

db_handler = DatabaseConnectionHandler()
engine = db_handler.get_engine()

with engine.connect() as conn:
    result = conn.execute(text('''
        SELECT email, COUNT(*) as count
        FROM accounts
        WHERE email IS NOT NULL
        GROUP BY email
        HAVING COUNT(*) > 1
    '''))
    duplicates = result.fetchall()
    if duplicates:
        print(f'Found {len(duplicates)} duplicate emails')
        for email, count in duplicates:
            print(f'  {email}: {count} occurrences')
    else:
        print('No duplicates found')
"
```

### 2. Handle Duplicates

You have several options:

#### Option A: Keep Oldest, Update Others (Recommended)

The migration script automatically handles this by:

- Keeping the account with the oldest `created_at` timestamp
- Updating other accounts' emails by appending a unique identifier

#### Option B: Manual Cleanup

If you prefer to handle duplicates manually:

```python
# Example: Update duplicate emails manually
from config.database_handler import DatabaseConnectionHandler
from sqlalchemy import text

db_handler = DatabaseConnectionHandler()
engine = db_handler.get_engine()

with engine.connect() as conn:
    # Find duplicates
    duplicates = conn.execute(text("""
        SELECT email, COUNT(*) as count
        FROM accounts
        WHERE email IS NOT NULL
        GROUP BY email
        HAVING COUNT(*) > 1
    """)).fetchall()

    for email, _ in duplicates:
        # Get accounts with this email, ordered by creation
        accounts = conn.execute(text("""
            SELECT id, username
            FROM accounts
            WHERE email = :email
            ORDER BY created_at ASC
        """), {"email": email}).fetchall()

        # Keep first, update others
        for account_id, username in accounts[1:]:
            new_email = f"{username}@updated.local"  # Your logic here
            conn.execute(text("""
                UPDATE accounts
                SET email = :new_email
                WHERE id = :account_id
            """), {"new_email": new_email, "account_id": account_id})

    conn.commit()
```

#### Option C: Delete Duplicates

⚠️ **Use with caution** - Only if duplicates are truly unwanted:

```python
# Keep only the oldest account for each email
with engine.connect() as conn:
    conn.execute(text("""
        DELETE FROM accounts
        WHERE id IN (
            SELECT id
            FROM (
                SELECT id,
                       ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) as rn
                FROM accounts
                WHERE email IS NOT NULL
            ) t
            WHERE rn > 1
        )
    """))
    conn.commit()
```

### 3. Run the Migration

```bash
# Using Alembic
alembic upgrade head

# Or if using a migration script
python migrate.py --run
```

### 4. Verify the Constraint

```python
from config.database_handler import DatabaseConnectionHandler
from sqlalchemy import inspect

db_handler = DatabaseConnectionHandler()
engine = db_handler.get_engine()

inspector = inspect(engine)
unique_constraints = inspector.get_unique_constraints('accounts')

for constraint in unique_constraints:
    if 'email' in constraint['column_names']:
        print(f"✅ Unique constraint exists on email: {constraint['name']}")
```

## Migration File Structure

The migration file (`add_unique_constraint_to_email.py`) includes:

1. **Duplicate Detection**: Checks for duplicates before applying constraint
2. **Automatic Cleanup**: Handles duplicates by keeping oldest and updating others
3. **Error Handling**: Provides clear error messages if migration fails
4. **Rollback Support**: Includes `downgrade()` function to remove constraint

## Important Notes

1. **Backup First**: Always backup your database before running migrations

   ```bash
   pg_dump your_database > backup.sql
   ```

2. **Test in Development**: Test the migration on a copy of production data first

3. **NULL Values**: If the column allows NULL, the unique constraint will allow multiple NULLs (SQL standard behavior). If you need to prevent NULLs, add `nullable=False` first.

4. **Index Creation**: Adding a unique constraint automatically creates an index, which can take time on large tables.

5. **Downtime**: For very large tables, consider:
   - Running during maintenance window
   - Using `CONCURRENTLY` option (PostgreSQL specific)
   - Testing migration time on a copy first

## Example: Adding Unique Constraint to Email

The provided migration (`add_unique_constraint_to_email.py`) demonstrates:

- Checking for duplicates
- Handling duplicates automatically
- Adding the unique constraint safely
- Proper error handling and rollback

## Troubleshooting

### Error: "duplicate key value violates unique constraint"

- You still have duplicates in the database
- Run the duplicate check script again
- Manually clean up remaining duplicates

### Error: "column contains null values"

- If email is required (`nullable=False`), update NULL values first
- If email can be nullable, the constraint will still work (allows multiple NULLs)

### Migration Takes Too Long

- For large tables, consider creating the index concurrently (PostgreSQL)
- Or run during a maintenance window
