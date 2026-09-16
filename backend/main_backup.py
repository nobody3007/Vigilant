from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import tenders_collection, analyses_collection

import xgboost as xgb
import pandas as pd
import json
import os
from datetime import datetime


app = FastAPI(title="VIGILANT Backend")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODEL FILES
# ============================================================

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


# ============================================================
# REQUEST MODEL
# ============================================================

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


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "message": "VIGILANT backend is running!"
    }


# ============================================================
# MODEL INPUT
# ============================================================

def create_model_input(tender):

    features = feature_defaults.copy()

    if isinstance(tender, dict):

        model_features = tender.get(
            "modelFeatures",
            {}
        )

        if model_features:

            for key, value in model_features.items():

                if key in feature_columns:
                    features[key] = value

        estimated_value = tender.get(
            "estimatedValue",
            features.get("estimated_value", 0)
        )

        contract_value = tender.get(
            "contractValue",
            features.get("final_contract_value", 0)
        )

        number_of_bidders = tender.get(
            "numberOfBidders",
            features.get("number_of_bidders", 0)
        )

        department = tender.get(
            "department",
            ""
        )

        category = tender.get(
            "category",
            ""
        )

        location = tender.get(
            "location",
            ""
        )

        specialization = tender.get(
            "vendorSpecialization",
            ""
        )

    else:

        estimated_value = tender.estimatedValue
        contract_value = tender.contractValue
        number_of_bidders = tender.numberOfBidders

        department = tender.department
        category = tender.category
        location = tender.location
        specialization = tender.vendorSpecialization

    features["estimated_value"] = estimated_value
    features["final_contract_value"] = contract_value
    features["number_of_bidders"] = number_of_bidders

    features["is_specialized_for_tender"] = int(
        specialization.lower() == category.lower()
        or specialization.lower() in category.lower()
        or category.lower() in specialization.lower()
    )

    # Reset one-hot columns
    for column in feature_columns:

        if (
            column.startswith("department_")
            or column.startswith("category_")
            or column.startswith("location_")
            or column.startswith("vendor_specialization_")
        ):
            features[column] = 0

    # Department
    department_column = f"department_{department}"

    if department_column in feature_columns:
        features[department_column] = 1

    # Category
    category_column = f"category_{category}"

    if category_column in feature_columns:
        features[category_column] = 1

    # Location
    location_column = f"location_{location}"

    if location_column in feature_columns:
        features[location_column] = 1

    # Vendor specialization
    specialization_column = (
        f"vendor_specialization_{specialization}"
    )

    if specialization_column in feature_columns:
        features[specialization_column] = 1

    df = pd.DataFrame(
        [
            [
                features.get(column, 0)
                for column in feature_columns
            ]
        ],
        columns=feature_columns
    )

    return df


# ============================================================
# PRIORITY
# ============================================================

def get_priority(score):

    if score >= 75:
        return "High"

    if score >= 50:
        return "Medium"

    return "Low"


# ============================================================
# SIGNALS
# ============================================================

def generate_signals(tender, score):

    features = tender.get(
        "modelFeatures",
        {}
    )

    signals = []

    price_deviation = float(
        features.get(
            "current_price_vs_comparable_percent",
            0
        )
    )

    unexplained_price = float(
        features.get(
            "price_dev_unexplained",
            0
        )
    )

    if price_deviation >= 10 or unexplained_price >= 5:

        signals.append({
            "name": "Price deviation",
            "value": round(price_deviation, 2),
            "unit": "%",
            "description":
                "Contract price differs noticeably from comparable procurement prices."
        })

    bid_similarity = float(
        features.get(
            "bid_similarity_percent",
            0
        )
    )

    if bid_similarity >= 90:

        signals.append({
            "name": "High bid similarity",
            "value": round(bid_similarity, 2),
            "unit": "%",
            "description":
                "Bid values show a high degree of similarity."
        })

    repeated = float(
        features.get(
            "b_c_repeatedly_participated",
            0
        )
    )

    shared_tenders = float(
        features.get(
            "shared_tenders",
            0
        )
    )

    if repeated > 0 or shared_tenders >= 10:

        signals.append({
            "name": "Repeated participation pattern",
            "value": int(shared_tenders),
            "unit": "shared tenders",
            "description":
                "Vendors have repeatedly appeared together across procurement events."
        })

    win_rate = float(
        features.get(
            "historical_win_rate",
            0
        )
    )

    previous_wins = float(
        features.get(
            "previous_wins",
            0
        )
    )

    if win_rate >= 75 and previous_wins >= 10:

        signals.append({
            "name": "High vendor win concentration",
            "value": round(win_rate, 2),
            "unit": "%",
            "description":
                "The vendor has historically won a large share of its comparable tenders."
        })

    network_strength = float(
        features.get(
            "network_relationship_strength",
            0
        )
    )

    if network_strength >= 0.75:

        signals.append({
            "name": "Strong network relationship",
            "value": round(network_strength, 3),
            "unit": "strength",
            "description":
                "The procurement record has strong historical relationships in the network."
        })

    market_increase = float(
        features.get(
            "market_price_increase",
            0
        )
    )

    if market_increase >= 10:

        signals.append({
            "name": "Market price movement",
            "value": round(market_increase, 2),
            "unit": "%",
            "description":
                "Broader market price movement may explain part of the observed price change."
        })

    if not signals:

        signals.append({
            "name": "No major derived signal",
            "value": 0,
            "unit": "",
            "description":
                "Available procurement features did not produce a major derived signal."
        })

    return signals


# ============================================================
# ANALYZE ONE TENDER
# ============================================================

def analyze_tender_document(tender):

    model_input = create_model_input(tender)

    prediction = model.predict(model_input)[0]

    score = round(
        max(0, min(float(prediction), 100)),
        2
    )

    priority = get_priority(score)

    signals = generate_signals(
        tender,
        score
    )

    return {
        "investigation_priority": score,
        "priority": priority,
        "signals": signals,
        "analyzed_at": datetime.utcnow()
    }


# ============================================================
# ADD TENDER
# ============================================================

@app.post("/api/tenders")
def add_tender(tender: Tender):

    try:

        model_input = create_model_input(tender)

        prediction = model.predict(model_input)[0]

        investigation_priority = round(
            max(0, min(float(prediction), 100)),
            2
        )

        priority = get_priority(
            investigation_priority
        )

        tender_data = tender.model_dump()

        tender_data["investigation_priority"] = (
            investigation_priority
        )

        tender_data["priority"] = priority

        tender_data["signals"] = generate_signals(
            tender_data,
            investigation_priority
        )

        result = tenders_collection.insert_one(
            tender_data
        )

        return {
            "message":
                "Tender added successfully",

            "tenderId":
                tender.tenderId,

            "databaseId":
                str(result.inserted_id),

            "investigationPriority":
                investigation_priority,

            "priority":
                priority
        }

    except Exception as error:

        print("Error adding tender:", error)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# ANALYZE ALL
# ============================================================

@app.post("/api/tenders/analyze-all")
def analyze_all_tenders():

    try:

        tenders = list(
            tenders_collection.find()
        )

        if not tenders:

            return {
                "message":
                    "No tenders found",
                "analyzed":
                    0
            }

        analyzed = 0

        for tender in tenders:

            result = analyze_tender_document(
                tender
            )

            tenders_collection.update_one(
                {
                    "_id":
                        tender["_id"]
                },
                {
                    "$set": {
                        "investigation_priority":
                            result["investigation_priority"],

                        "priority":
                            result["priority"],

                        "signals":
                            result["signals"],

                        "analyzed_at":
                            result["analyzed_at"]
                    }
                }
            )

            analyzed += 1

        return {
            "message":
                "All tenders analyzed successfully",

            "analyzed":
                analyzed
        }

    except Exception as error:

        print(
            "Error analyzing tenders:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# ============================================================
# GET ALL TENDERS
# ============================================================

@app.get("/api/tenders")
def get_tenders():

    tenders = list(
        tenders_collection.find()
        .sort(
            "investigation_priority",
            -1
        )
    )

    for tender in tenders:

        tender["_id"] = str(
            tender["_id"]
        )

    return tenders


# ============================================================
# GET SINGLE TENDER
# ============================================================

@app.get("/api/tenders/{tender_id}")
def get_tender(tender_id: str):

    tender = tenders_collection.find_one(
        {
            "tenderId":
                tender_id
        }
    )

    if not tender:

        raise HTTPException(
            status_code=404,
            detail="Tender not found"
        )

    tender["_id"] = str(
        tender["_id"]
    )

    return tender


# ============================================================
# DASHBOARD SUMMARY
# ============================================================

@app.get("/api/dashboard/summary")
def dashboard_summary():

    total_tenders = (
        tenders_collection.count_documents({})
    )

    total_vendors = len(
        tenders_collection.distinct(
            "winningVendorId"
        )
    )

    high = (
        tenders_collection.count_documents(
            {
                "investigation_priority": {
                    "$gte": 75
                }
            }
        )
    )

    medium = (
        tenders_collection.count_documents(
            {
                "investigation_priority": {
                    "$gte": 50,
                    "$lt": 75
                }
            }
        )
    )

    low = (
        tenders_collection.count_documents(
            {
                "investigation_priority": {
                    "$lt": 50
                }
            }
        )
    )

    analyzed = (
        tenders_collection.count_documents(
            {
                "investigation_priority": {
                    "$exists": True
                }
            }
        )
    )

    return {
        "totalTenders":
            total_tenders,

        "totalVendors":
            total_vendors,

        "highPriority":
            high,

        "mediumPriority":
            medium,

        "lowPriority":
            low,

        "analyzedTenders":
            analyzed
    }


# ============================================================
# INVESTIGATIONS
# ============================================================

@app.get("/api/investigations")
def investigations():

    tenders = list(
        tenders_collection.find(
            {
                "investigation_priority": {
                    "$exists": True
                }
            }
        ).sort(
            "investigation_priority",
            -1
        )
    )

    results = []

    for tender in tenders:

        results.append({
            "caseId":
                f"INV-{tender.get('tenderId')}",

            "tenderId":
                tender.get("tenderId"),

            "vendor":
                tender.get("winningVendor"),

            "department":
                tender.get("department"),

            "category":
                tender.get("category"),

            "location":
                tender.get("location"),

            "value":
                tender.get("contractValue"),

            "score":
                tender.get(
                    "investigation_priority",
                    0
                ),

            "priority":
                tender.get(
                    "priority",
                    "Low"
                ),

            "signals":
                tender.get(
                    "signals",
                    []
                )
        })

    return results


# ============================================================
# EVIDENCE
# ============================================================

@app.get("/api/tenders/{tender_id}/evidence")
def tender_evidence(tender_id: str):

    tender = tenders_collection.find_one(
        {
            "tenderId":
                tender_id
        }
    )

    if not tender:

        raise HTTPException(
            status_code=404,
            detail="Tender not found"
        )

    features = tender.get(
        "modelFeatures",
        {}
    )

    signals = tender.get(
        "signals",
        []
    )

    evidence = []

    for signal in signals:

        name = signal.get(
            "name",
            "Unknown signal"
        )

        if name == "Price deviation":

            evidence.append({
                "rawEvidence": {
                    "field":
                        "current_price_vs_comparable_percent",

                    "value":
                        features.get(
                            "current_price_vs_comparable_percent",
                            0
                        )
                },

                "derivedSignal":
                    "Price deviation",

                "interpretation":
                    "Contract price differs from comparable procurement prices."
            })

        elif name == "High bid similarity":

            evidence.append({
                "rawEvidence": {
                    "field":
                        "bid_similarity_percent",

                    "value":
                        features.get(
                            "bid_similarity_percent",
                            0
                        )
                },

                "derivedSignal":
                    "High bid similarity",

                "interpretation":
                    "Bid values show a high degree of similarity."
            })

        elif name == "Repeated participation pattern":

            evidence.append({
                "rawEvidence": {
                    "field":
                        "shared_tenders",

                    "value":
                        features.get(
                            "shared_tenders",
                            0
                        )
                },

                "derivedSignal":
                    "Repeated participation pattern",

                "interpretation":
                    "Vendors repeatedly appear together in procurement events."
            })

        elif name == "High vendor win concentration":

            evidence.append({
                "rawEvidence": {
                    "field":
                        "historical_win_rate",

                    "value":
                        features.get(
                            "historical_win_rate",
                            0
                        )
                },

                "derivedSignal":
                    "High vendor win concentration",

                "interpretation":
                    "Historical vendor win rate is elevated."
            })

        elif name == "Strong network relationship":

            evidence.append({
                "rawEvidence": {
                    "field":
                        "network_relationship_strength",

                    "value":
                        features.get(
                            "network_relationship_strength",
                            0
                        )
                },

                "derivedSignal":
                    "Strong network relationship",

                "interpretation":
                    "The record has strong historical network relationships."
            })

        elif name == "Market price movement":

            evidence.append({
                "rawEvidence": {
                    "field":
                        "market_price_increase",

                    "value":
                        features.get(
                            "market_price_increase",
                            0
                        )
                },

                "derivedSignal":
                    "Market price movement",

                "interpretation":
                    "Market movement may explain part of the price change."
            })

    return {
        "tenderId":
            tender.get("tenderId"),

        "priority":
            tender.get(
                "priority",
                "Low"
            ),

        "score":
            tender.get(
                "investigation_priority",
                0
            ),

        "tender": {
            "department":
                tender.get("department"),

            "category":
                tender.get("category"),

            "location":
                tender.get("location"),

            "estimatedValue":
                tender.get("estimatedValue"),

            "contractValue":
                tender.get("contractValue"),

            "numberOfBidders":
                tender.get("numberOfBidders"),

            "winningVendor":
                tender.get("winningVendor"),

            "procurementMethod":
                tender.get("procurementMethod"),

            "publicationDate":
                tender.get("publicationDate")
        },

        "evidence":
            evidence
    }