import os
import sys
# pyrefly: ignore [missing-import]
from decouple import config
# pyrefly: ignore [missing-import]
from pymongo import MongoClient
# pyrefly: ignore [missing-import]
from pymongo.errors import ConnectionFailure, OperationFailure

def test_mongodb_connection():
    # Get the URI from .env
    mongo_uri = config('MONGO_URI', default='')
    
    if not mongo_uri or '<db_username>' in mongo_uri:
        print("[Error]: Please update <db_username> in your backend/.env file with your actual MongoDB username.")
        sys.exit(1)
        
    print(f"Attempting to connect to MongoDB Atlas...")
    
    try:
        # The django-mongodb-backend uses pymongo under the hood
        # We set a short timeout so it fails quickly if there's an issue
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # The ismaster command is cheap and does not require auth
        client.admin.command('ismaster')
        
        print("[Success]: Successfully connected to MongoDB cluster!")
        
        # Test authentication by accessing a specific database (or list databases)
        # This will fail if username/password are wrong
        db_name = config('MONGO_DB_NAME', default='hadescore_db')
        print(f"Testing access to database '{db_name}'...")
        
        # Just getting collection names to verify auth
        client[db_name].list_collection_names()
        
        print(f"[Success]: Successfully authenticated and accessed database '{db_name}'!")
        print("Your MongoDB Atlas connection is fully working!")
        
    except ConnectionFailure as e:
        print("[Error]: Connection failed! Make sure your IP address is whitelisted in MongoDB Atlas Network Access.")
        print(f"Details: {e}")
    except OperationFailure as e:
        print("[Error]: Authentication failed! Check your database username and password.")
        print(f"Details: {e}")
    except Exception as e:
        print(f"[Error]: An unexpected error occurred: {e}")

if __name__ == '__main__':
    test_mongodb_connection()
