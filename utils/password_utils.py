"""Password hashing utilities."""

from werkzeug.security import generate_password_hash, check_password_hash


def hash_password(password: str) -> str:
    """
    Hash a password using Werkzeug's secure password hashing.
    
    Uses PBKDF2-HMAC-SHA256 by default, which is cryptographically secure.
    
    **Salt is automatically generated and included in the hash!**
    - Each password gets a unique random salt
    - Salt is embedded in the hash string itself
    - Format: pbkdf2:sha256:260000$<salt>$<hash>
    
    Example:
        hash1 = hash_password("mypassword")  # Different salt each time
        hash2 = hash_password("mypassword")   # Different hash due to different salt
        # Both verify correctly with verify_password()
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string with embedded salt
        Format: pbkdf2:sha256:260000$<random_salt>$<hash>
    """
    return generate_password_hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    """
    Verify a password against a hash.
    
    **Automatically extracts salt from the hash!**
    - The salt is embedded in the password_hash string
    - No need to store salt separately
    - Werkzeug handles salt extraction automatically
    
    Args:
        password_hash: Hashed password from database (includes salt)
        password: Plain text password to verify
        
    Returns:
        True if password matches, False otherwise
    """
    return check_password_hash(password_hash, password)

