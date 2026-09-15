import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load the variables from .env
load_dotenv()

# Get the MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI")

# Check that we actually got it
if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in .env")

# Connect to MongoDB
client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000
)

# Select the VIGILANT database
db = client["vigilant"]

# Collections we will use
tenders_collection = db["tenders"]
vendors_collection = db["vendors"]
analyses_collection = db["analyses"]