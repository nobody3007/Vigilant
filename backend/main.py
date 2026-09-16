from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import tenders_collection

import xgboost as xgb
import pandas as pd
import json
import os


app = FastAPI(title="VIGILANT Backend")


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# LOAD ML MODEL
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "vigilant_model.json"
)

FEATURE_COLUMNS_PATH = os.path.join(
    BASE_DIR,
    "feature_columns.json"
)

DEFAULTS_PATH = os.path.join(
    BASE_DIR,
    "feature_defaults.json"
)


model = xgb.XGBRegressor()
model.load_model(MODEL_PATH)


with open(FEATURE_COLUMNS_PATH, "r") as f:
    feature_columns = json.load(f)


with open(DEFAULTS_PATH, "r") as f:
    feature_defaults = json.load(f)


print("ML model loaded successfully")
print("Number of model features:", len(feature_columns))


# ==========================================
# TENDER DATA STRUCTURE
# ==========================================

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


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "VIGILANT backend is running!"
    }


# ==========================================
# CREATE MODEL INPUT
# ==========================================

def create_model_input(tender):
    """
    Converts the 9 fields entered by the user
    into the feature structure expected by the ML model.
    """

    # Start with the default values learned from
    # the training dataset.
    features = feature_defaults.copy()

    # ------------------------------------------
    # Features directly available from the form
    # ------------------------------------------

    features["estimated_value"] = tender.estimatedValue

    features["final_contract_value"] = tender.contractValue

    features["number_of_bidders"] = tender.numberOfBidders


    # ------------------------------------------
    # Calculate a few features we can derive
    # from the submitted tender itself.
    # ------------------------------------------

    # Is vendor specialization the same as
    # tender category?
    features["is_specialized_for_tender"] = int(
        tender.vendorSpecialization.lower()
        == tender.category.lower()
    )


    # ------------------------------------------
    # Convert to DataFrame
    # ------------------------------------------

    df = pd.DataFrame([features])


    # ------------------------------------------
    # Convert categorical columns
    # ------------------------------------------

    categorical_columns = [
        "department",
        "category",
        "location",
        "vendor_specialization"
    ]

    df["department"] = tender.department
    df["category"] = tender.category
    df["location"] = tender.location
    df["vendor_specialization"] = tender.vendorSpecialization


    df = pd.get_dummies(
        df,
        columns=categorical_columns,
        drop_first=True
    )


    # ------------------------------------------
    # Make sure the columns are EXACTLY the same
    # as during training.
    # ------------------------------------------

    df = df.reindex(
        columns=feature_columns,
        fill_value=0
    )


    return df


# ==========================================
# ADD TENDER
# ==========================================

@app.post("/api/tenders")
def add_tender(tender: Tender):

    try:

        # --------------------------------------
        # Create ML input
        # --------------------------------------

        model_input = create_model_input(tender)


        # --------------------------------------
        # Predict investigation priority
        # --------------------------------------

        prediction = model.predict(model_input)[0]


        # Keep score between 0 and 100
        investigation_priority = round(
            max(0, min(float(prediction), 100)),
            2
        )


        # --------------------------------------
        # Save tender to MongoDB
        # --------------------------------------

        tender_data = tender.model_dump()

        tender_data["investigation_priority"] = (
            investigation_priority
        )


        result = tenders_collection.insert_one(
            tender_data
        )


        # --------------------------------------
        # Return result
        # --------------------------------------

        return {
            "message": "Tender added successfully",
            "tenderId": tender.tenderId,
            "databaseId": str(result.inserted_id),
            "investigationPriority": investigation_priority
        }


    except Exception as error:

        print("Error adding tender:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ==========================================
# GET ALL TENDERS
# ==========================================

@app.get("/api/tenders")
def get_tenders():

    tenders = list(
        tenders_collection.find()
    )

    for tender in tenders:
        tender["_id"] = str(
            tender["_id"]
        )

    return tenders