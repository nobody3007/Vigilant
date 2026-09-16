import json
import os
import numpy as np
import pandas as pd
import xgboost as xgb
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# -----------------------------
# MongoDB
# -----------------------------
client = MongoClient(os.getenv("MONGO_URI"))
db = client["vigilant"]
tenders_collection = db["tenders"]

# -----------------------------
# Model features
# -----------------------------
with open("feature_columns.json", "r") as f:
    FEATURES = json.load(f)

tenders = list(tenders_collection.find())

if not tenders:
    raise RuntimeError("No tenders found in MongoDB")

print("Tenders loaded:", len(tenders))
print("Model features:", len(FEATURES))

# -----------------------------
# Build training dataframe
# -----------------------------
rows = []

for tender in tenders:
    mf = tender.get("modelFeatures", {})

    row = {}

    # Numeric/model features
    for feature in FEATURES:
        if feature in mf:
            row[feature] = mf[feature]
        else:
            row[feature] = 0

    # Categorical one-hot features
    department = tender.get("department", "")
    category = tender.get("category", "")
    location = tender.get("location", "")
    specialization = tender.get("vendorSpecialization", "")

    for feature in FEATURES:
        if feature.startswith("department_"):
            row[feature] = int(feature == f"department_{department}")

        elif feature.startswith("category_"):
            row[feature] = int(feature == f"category_{category}")

        elif feature.startswith("location_"):
            row[feature] = int(feature == f"location_{location}")

        elif feature.startswith("vendor_specialization_"):
            row[feature] = int(
                feature == f"vendor_specialization_{specialization}"
            )

    rows.append(row)

X = pd.DataFrame(rows)[FEATURES]

# Make sure everything is numeric
X = X.apply(pd.to_numeric, errors="coerce").fillna(0)

# -----------------------------
# EXACT V2 FEATURES FROM NOTEBOOK
# -----------------------------
X["price_dev_unexplained"] = (
    X["current_price_vs_comparable_percent"]
    * (1 - X["is_specialized_for_tender"])
)

X["price_dev_explained_by_market"] = (
    X["current_price_vs_comparable_percent"]
    * (X["market_price_increase"] / 20.0).clip(upper=1)
)

X["winrate_unexplained"] = (
    X["historical_win_rate"]
    * (1 - X["is_specialized_for_tender"])
)

X["bid_similarity_unexplained"] = (
    X["bid_similarity_percent"]
    * (1 - X["is_specialized_for_tender"])
)

# Ensure exact feature order
X = X[FEATURES]

# -----------------------------
# EXACT V2 TARGET FROM NOTEBOOK
# -----------------------------
price_signal = np.maximum(
    X["current_price_vs_comparable_percent"], 0
) * 1.5

bid_signal = np.maximum(
    X["bid_similarity_percent"] - 50, 0
) * 0.8

network_signal = X["network_relationship_strength"] * 40

winrate_signal = np.maximum(
    X["historical_win_rate"] - 40, 0
) * 0.5

shared_signal = np.minimum(
    X["shared_tenders"], 20
) * 1.5

raw_score = (
    price_signal
    + bid_signal
    + network_signal
    + winrate_signal
    + shared_signal
)

suppression = np.ones(len(X))

# Specialist explanation
suppression *= np.where(
    X["is_specialized_for_tender"] == 1,
    0.55,
    1.0
)

# Market explanation
market_explained = np.minimum(
    X["market_price_increase"] / 20.0,
    1.0
)

suppression *= (
    1 - market_explained * 0.4
)

# Regional explanation
region_explained = np.minimum(
    X["regional_price_variation"] / 15.0,
    1.0
)

suppression *= (
    1 - region_explained * 0.2
)

y = np.clip(
    raw_score * suppression,
    0,
    100
)

# -----------------------------
# Save dataset
# -----------------------------
dataset = X.copy()
dataset["investigation_priority"] = y.round(2)

dataset.to_csv(
    "vigilant_training_dataset.csv",
    index=False
)

# -----------------------------
# Train XGBoost
# -----------------------------
model = xgb.XGBRegressor(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    objective="reg:squarederror"
)

model.fit(X, y)

model.save_model("vigilant_model.json")

# -----------------------------
# Update MongoDB with predictions
# -----------------------------
predictions = model.predict(X)
predictions = np.clip(predictions, 0, 100)

for tender, prediction in zip(tenders, predictions):

    score = round(float(prediction), 2)

    if score >= 75:
        priority = "High"
    elif score >= 50:
        priority = "Medium"
    else:
        priority = "Low"

    tenders_collection.update_one(
        {"_id": tender["_id"]},
        {
            "$set": {
                "investigation_priority": score,
                "priority": priority
            }
        }
    )

# -----------------------------
# Results
# -----------------------------
print()
print("================================")
print("VIGILANT ML SETUP COMPLETE")
print("================================")
print("Dataset:", len(dataset))
print("Features:", len(FEATURES))
print("Score min:", round(float(predictions.min()), 2))
print("Score max:", round(float(predictions.max()), 2))
print("Score avg:", round(float(predictions.mean()), 2))
print("High:", int((predictions >= 75).sum()))
print("Medium:", int(((predictions >= 50) & (predictions < 75)).sum()))
print("Low:", int((predictions < 50).sum()))
print("Dataset: vigilant_training_dataset.csv")
print("Model: vigilant_model.json")
print("MongoDB updated:", len(predictions))
