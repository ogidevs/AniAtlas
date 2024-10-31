import bcrypt

def hash_password(password: str) -> str:
    """Hash a password for storing."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def check_password(hashed_password: str, password: str) -> bool:
    """Check a hashed password against a plain text password."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))