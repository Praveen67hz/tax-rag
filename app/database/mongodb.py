from pymongo import MongoClient

from app.config.settings import (
    COLLECTION_NAME,
    DATABASE_NAME,
    MONGODB_URI,
)


def get_mongodb_collection():
    """
    Connect to MongoDB Atlas and return the documents collection.
    """

    if not MONGODB_URI:
        raise ValueError("MONGODB_URI is not set in the environment.")

    client = MongoClient(MONGODB_URI)

    client.admin.command("ping")

    db = client[DATABASE_NAME]

    collection = db[COLLECTION_NAME]

    return collection