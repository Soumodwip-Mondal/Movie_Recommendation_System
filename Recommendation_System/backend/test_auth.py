"""
Test script to verify authentication setup
"""
import sys

def test_imports():
    """Test if all required packages are installed"""
    print("Testing imports...")
    
    try:
        import fastapi
        print("✓ FastAPI installed")
    except ImportError as e:
        print(f"✗ FastAPI not installed: {e}")
        return False
    
    try:
        import passlib
        from passlib.context import CryptContext
        print("✓ Passlib installed")
    except ImportError as e:
        print(f"✗ Passlib not installed: {e}")
        return False
    
    try:
        import bcrypt
        print("✓ Bcrypt installed")
    except ImportError as e:
        print(f"✗ Bcrypt not installed: {e}")
        return False
    
    try:
        from jose import jwt
        print("✓ Python-jose installed")
    except ImportError as e:
        print(f"✗ Python-jose not installed: {e}")
        return False
    
    try:
        import pymongo
        print("✓ Pymongo installed")
    except ImportError as e:
        print(f"✗ Pymongo not installed: {e}")
        return False
    
    try:
        from pydantic_settings import BaseSettings
        print("✓ Pydantic-settings installed")
    except ImportError as e:
        print(f"✗ Pydantic-settings not installed: {e}")
        return False
    
    return True

def test_auth_setup():
    """Test password hashing"""
    print("\nTesting password hashing...")
    
    try:
        from passlib.context import CryptContext
        context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Test password hashing
        password = "test123"
        hashed = context.hash(password)
        print(f"✓ Password hashing works")
        
        # Test password verification
        is_valid = context.verify(password, hashed)
        if is_valid:
            print("✓ Password verification works")
        else:
            print("✗ Password verification failed")
            return False
            
        return True
    except Exception as e:
        print(f"✗ Auth setup failed: {e}")
        return False

def test_database():
    """Test MongoDB connection"""
    print("\nTesting MongoDB connection...")
    
    try:
        from pymongo import MongoClient
        import os
        from dotenv import load_dotenv
        
        # Try to load .env
        load_dotenv()
        db_url = os.getenv("DATABASE_URL")
        
        if not db_url:
            print("⚠ No DATABASE_URL in .env file")
            return False
        
        # Test connection
        client = MongoClient(db_url, serverSelectionTimeoutMS=5000)
        client.server_info()
        print("✓ MongoDB connection successful")
        return True
    except Exception as e:
        print(f"✗ MongoDB connection failed: {e}")
        return False

def main():
    print("=" * 50)
    print("Backend Setup Verification")
    print("=" * 50)
    
    all_tests_passed = True
    
    if not test_imports():
        all_tests_passed = False
        print("\n⚠ Missing dependencies. Install with:")
        print("pip install -r requirements.txt")
    
    if not test_auth_setup():
        all_tests_passed = False
    
    if not test_database():
        all_tests_passed = False
    
    print("\n" + "=" * 50)
    if all_tests_passed:
        print("✓ All tests passed! Backend is ready.")
    else:
        print("✗ Some tests failed. Check errors above.")
    print("=" * 50)
    
    return 0 if all_tests_passed else 1

if __name__ == "__main__":
    sys.exit(main())
