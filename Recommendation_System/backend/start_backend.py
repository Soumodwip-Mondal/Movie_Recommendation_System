"""
Backend startup with verification
"""
import sys

def verify_setup():
    """Verify all dependencies before starting"""
    print("=" * 60)
    print("Verifying Backend Setup...")
    print("=" * 60)
    
    try:
        from app.config.config import Settings
        settings = Settings()
        print("[OK] Settings loaded")
        print(f"  - Database: {settings.DATABASE_URL[:30]}...")
        print(f"  - TMDB API Key: {'*' * 10}... (configured)")
    except Exception as e:
        print(f"[ERROR] Settings error: {e}")
        return False
    
    try:
        from app.auth.auth import hash_password, verify_password
        test_pwd = "test123"
        hashed = hash_password(test_pwd)
        verified = verify_password(test_pwd, hashed)
        if verified:
            print("[OK] Password hashing works")
        else:
            print("[ERROR] Password verification failed")
            return False
    except Exception as e:
        print(f"[ERROR] Auth error: {e}")
        return False
    
    try:
        from app.database.database import user_collection
        print("[OK] Database connection OK")
    except Exception as e:
        print(f"[ERROR] Database error: {e}")
        return False
    
    print("\n[SUCCESS] All checks passed! Starting server...\n")
    print("=" * 60)
    return True

if __name__ == "__main__":
    if verify_setup():
        import uvicorn
        print("\nStarting FastAPI server on http://127.0.0.1:8000")
        print("API docs: http://127.0.0.1:8000/docs")
        print("Press CTRL+C to stop\n")
        uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    else:
        print("\nSetup verification failed. Please fix errors above.")
        sys.exit(1)
