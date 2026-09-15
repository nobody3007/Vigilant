from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import tenders_collection

app = FastAPI(title="VIGILANT Backend")


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Tender data structure
# -----------------------------

class Tender(BaseModel):
    tenderId: str
    department: str
    category: str
    location: str
    estimatedValue: float
    contractValue: float
    numberOfBidders: int
    winningVendor: str
    vendorSpecialization: str


# -----------------------------
# Home
# -----------------------------

@app.get("/")
def home():
    return {
        "message": "VIGILANT backend is running!"
    }


# -----------------------------
# Add Tender
# -----------------------------

@app.post("/api/tenders")
def add_tender(tender: Tender):

    tender_data = tender.model_dump()

    result = tenders_collection.insert_one(tender_data)

    return {
        "message": "Tender added successfully",
        "tenderId": tender.tenderId,
        "databaseId": str(result.inserted_id)
    }


# -----------------------------
# Get all Tenders
# -----------------------------

@app.get("/api/tenders")
def get_tenders():

    tenders = list(tenders_collection.find())

    for tender in tenders:
        tender["_id"] = str(tender["_id"])

    return tenders