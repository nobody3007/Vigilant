from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import json
import os
from typing import Any

import numpy as np
import pandas as pd
import xgboost as xgb


# ============================================================
# APP
# ============================================================

app = FastAPI(title="VIGILANT Backend")


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "vigilant_model.json")
FEATURE_COLUMNS_PATH = os.path.join(BASE_DIR, "feature_columns.json")

DATASET_CANDIDATES = [
    # Model input: processed 48-feature dataset.
    os.path.join(BASE_DIR, "vigilant_training_dataset.csv"),
]

# Raw procurement metadata. This file contains the original tender IDs and
# winning vendor names, but it is NOT used as model input.
METADATA_PATH = os.path.join(BASE_DIR, "vigilant_dataset.csv")


# ============================================================
# LOAD MODEL
# ============================================================

model = None
model_error = None

try:
    model = xgb.XGBRegressor()
    model.load_model(MODEL_PATH)
    print("ML model loaded successfully")
except Exception as error:
    model_error = str(error)
    print("ERROR loading ML model:", error)


# ============================================================
# LOAD FEATURE COLUMNS
# ============================================================

feature_columns: list[str] = []

try:
    with open(FEATURE_COLUMNS_PATH, "r", encoding="utf-8") as file:
        feature_columns = json.load(file)

    print("Number of model features:", len(feature_columns))
except Exception as error:
    print("ERROR loading feature columns:", error)


# ============================================================
# LOAD DATASET
# ============================================================

dataset = pd.DataFrame()

for candidate in DATASET_CANDIDATES:
    if os.path.exists(candidate):
        try:
            dataset = pd.read_csv(candidate)

            dataset.columns = (
                dataset.columns
                .astype(str)
                .str.strip()
            )

            print("Government dataset loaded successfully")
            print("Dataset file:", os.path.basename(candidate))
            print("Dataset shape:", dataset.shape)
            print("Dataset columns:", dataset.columns.tolist())
            break
        except Exception as error:
            print("ERROR reading dataset:", error)

if dataset.empty:
    print("ERROR: No model dataset CSV found.")


# ============================================================
# LOAD RAW PROCUREMENT METADATA
# ============================================================

metadata_dataset = pd.DataFrame()

if os.path.exists(METADATA_PATH):
    try:
        metadata_dataset = pd.read_csv(METADATA_PATH)
        metadata_dataset.columns = (
            metadata_dataset.columns
            .astype(str)
            .str.strip()
        )
        print("Raw procurement metadata loaded successfully")
        print("Metadata shape:", metadata_dataset.shape)
    except Exception as error:
        print("ERROR reading raw procurement metadata:", error)
else:
    print("WARNING: Raw procurement metadata file not found.")


# ============================================================
# HELPERS
# ============================================================

def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        number = float(value)
        if np.isfinite(number):
            return number
    except (TypeError, ValueError):
        pass
    return default


def safe_int(value: Any, default: int = 0) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def row_value(row: pd.Series, column: str, default: Any = None) -> Any:
    """Safely read a value from a pandas row.

    Some columns (for example the generated ``signals`` column) contain
    lists/dicts. ``pd.notna()`` on those values returns an array, which
    cannot be used directly in an ``if`` statement.
    """
    if column not in row.index:
        return default

    value = row[column]

    if value is None:
        return default

    # Keep list/tuple/dict/ndarray values as-is.
    if isinstance(value, (list, tuple, dict, np.ndarray)):
        return value

    try:
        if pd.isna(value):
            return default
    except (TypeError, ValueError):
        # If pandas cannot reduce the value to a scalar boolean, return it
        # unchanged rather than crashing the API.
        return value

    return value


def get_priority(score: float) -> str:
    score = safe_float(score)
    if score >= 75:
        return "High"
    if score >= 50:
        return "Medium"
    return "Low"


def build_priority_scores(raw_predictions: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Create a relative 0-100 prototype priority score.

    XGBoost is a regression model, so its raw output can slightly exceed the
    training target range. The raw prediction is retained for transparency.

    The displayed score is a percentile-style score within the current
    dataset. It preserves the model's ranking while avoiding the misleading
    interpretation of the number as a probability or confidence percentage.

    The plotting-position formula keeps the endpoints just inside 0 and 100,
    so the UI can show decimal scores rather than a wall of 100s.
    """
    raw = np.asarray(raw_predictions, dtype=float)

    if raw.size == 0:
        return raw, raw

    order = np.argsort(raw, kind="mergesort")
    ranks = np.empty(raw.size, dtype=float)
    ranks[order] = np.arange(1, raw.size + 1, dtype=float)

    # Mid-rank percentile: for N records the largest value is
    # 100 * (N - 0.5) / N, not 100 exactly.
    priority_scores = 100.0 * (ranks - 0.5) / raw.size
    priority_scores = np.clip(priority_scores, 0.01, 99.99)

    return raw, np.round(priority_scores, 2)


def decode_one_hot(row: pd.Series, prefix: str, default: str = "Unknown") -> str:
    candidates = []
    for column in row.index:
        if column.startswith(prefix):
            value = safe_float(row[column], 0)
            if value > 0:
                candidates.append(column[len(prefix):])

    if candidates:
        return candidates[0]

    return default


def tender_id_for_index(index_value: int) -> str:
    # Stable internal display ID used by the current frontend routes.
    return f"DATA-{index_value + 1:05d}"


def metadata_row_for_index(index_value: int) -> pd.Series | None:
    if metadata_dataset.empty:
        return None
    if index_value < 0 or index_value >= len(metadata_dataset):
        return None
    return metadata_dataset.iloc[index_value]


def metadata_value(index_value: int, column: str, default: Any = "") -> Any:
    row = metadata_row_for_index(index_value)
    if row is None or column not in row.index:
        return default
    return row_value(row, column, default)


def tender_payload(row: pd.Series, tender_id: str) -> dict:
    row_number = safe_int(row_value(row, "_row_number", 0))
    raw_tender_id = str(metadata_value(row_number, "tender_id", tender_id))
    vendor = "Source vendor not linked to processed model row"

    return {
        "_id": tender_id,
        "tenderId": tender_id,
        "sourceTenderId": raw_tender_id,
        "department": decode_one_hot(row, "department_"),
        "category": decode_one_hot(row, "category_"),
        "location": decode_one_hot(row, "location_"),
        "estimatedValue": safe_float(row_value(row, "estimated_value", metadata_value(row_number, "estimated_value", 0))),
        "contractValue": safe_float(row_value(row, "final_contract_value", metadata_value(row_number, "final_contract_value", 0))),
        "numberOfBidders": safe_int(row_value(row, "number_of_bidders", metadata_value(row_number, "number_of_bidders", 0))),
        "winningVendor": vendor,
        "vendorSpecialization": decode_one_hot(row, "vendor_specialization_"),
        "investigation_priority": safe_float(row_value(row, "investigation_priority", 0)),
        "priority": row_value(row, "priority", "Low"),
        "rawModelScore": safe_float(row_value(row, "raw_model_score", 0)),
        "signals": row_value(row, "signals", []),
    }


def build_signals(row: pd.Series) -> list[dict]:
    signals = []

    price = safe_float(
        row_value(row, "current_price_vs_comparable_percent", 0)
    )
    bid_similarity = safe_float(
        row_value(row, "bid_similarity_percent", 0)
    )
    shared_tenders = safe_float(
        row_value(row, "shared_tenders", 0)
    )
    repeated = safe_int(
        row_value(row, "b_c_repeatedly_participated", 0)
    )
    win_rate = safe_float(
        row_value(row, "historical_win_rate", 0)
    )
    previous_wins = safe_float(
        row_value(row, "previous_wins", 0)
    )
    network = safe_float(
        row_value(row, "network_relationship_strength", 0)
    )
    market = safe_float(
        row_value(row, "market_price_increase", 0)
    )

    if price >= 10:
        signals.append({
            "name": "Price deviation",
            "value": round(price, 2),
            "unit": "%",
            "description": "Contract price differs noticeably from comparable procurement prices.",
        })

    if bid_similarity >= 90:
        signals.append({
            "name": "High bid similarity",
            "value": round(bid_similarity, 2),
            "unit": "%",
            "description": "Bid values show a high degree of similarity.",
        })

    if repeated > 0 or shared_tenders >= 10:
        signals.append({
            "name": "Repeated participation pattern",
            "value": int(shared_tenders),
            "unit": "shared tenders",
            "description": "Vendors have repeatedly appeared together across procurement events.",
        })

    if win_rate >= 75 and previous_wins >= 10:
        signals.append({
            "name": "High vendor win concentration",
            "value": round(win_rate, 2),
            "unit": "%",
            "description": "The vendor has historically won a large share of comparable tenders.",
        })

    if network >= 0.75:
        signals.append({
            "name": "Strong network relationship",
            "value": round(network, 3),
            "unit": "strength",
            "description": "The procurement record has strong historical relationships in the network.",
        })

    if market >= 10:
        signals.append({
            "name": "Market price movement",
            "value": round(market, 2),
            "unit": "%",
            "description": "Broader market price movement may explain part of the observed price change.",
        })

    if not signals:
        signals.append({
            "name": "No major derived signal",
            "value": 0,
            "unit": "",
            "description": "Available procurement features did not produce a major derived signal.",
        })

    return signals


def prepare_model_input(df: pd.DataFrame) -> pd.DataFrame:
    """Use the already-processed 48-feature CSV exactly as stored."""
    if df.empty or not feature_columns:
        return pd.DataFrame()

    X = df.copy()

    # The current CSV already contains the 48 processed model features.
    # Do NOT one-hot encode or engineer these columns again.
    for column in feature_columns:
        if column not in X.columns:
            X[column] = 0

    X = X[feature_columns]
    X = X.apply(pd.to_numeric, errors="coerce")
    X = X.replace([np.inf, -np.inf], 0).fillna(0)

    return X


def analyze_dataset() -> pd.DataFrame:
    if dataset.empty or model is None or not feature_columns:
        return pd.DataFrame()

    X = prepare_model_input(dataset)

    if X.empty:
        return pd.DataFrame()

    try:
        predictions = model.predict(X)
    except Exception as error:
        print("ERROR during model prediction:", error)
        return pd.DataFrame()

    results = dataset.copy()
    results["_row_number"] = np.arange(len(results))

    # Keep the actual XGBoost regression output internally. Do not present it
    # as a probability or confidence percentage.
    raw_predictions, priority_scores = build_priority_scores(predictions)

    results["raw_model_score"] = np.round(raw_predictions, 4)
    results["investigation_priority"] = priority_scores
    results["priority"] = results["investigation_priority"].apply(get_priority)
    results["signals"] = results.apply(build_signals, axis=1)

    return results


# ============================================================
# PRE-COMPUTE ANALYSIS
# ============================================================

analysis_data = analyze_dataset()

print("Analyzed tenders:", len(analysis_data))


# ============================================================
# HOME / HEALTH
# ============================================================

@app.get("/")
def home():
    return {
        "message": "VIGILANT backend is running!",
        "tenders_loaded": int(len(analysis_data)),
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "model_file_exists": os.path.exists(MODEL_PATH),
        "model_path": MODEL_PATH,
        "model_error": model_error,
        "dataset_loaded": not dataset.empty,
        "metadata_loaded": not metadata_dataset.empty,
        "metadata_records": int(len(metadata_dataset)),
        "tenders_analyzed": int(len(analysis_data)),
        "model_features": len(feature_columns),
    }

# ============================================================
# VENDOR LOOKUP
# ============================================================

RAW_DATASET_PATH = os.path.join(
    BASE_DIR,
    "vigilant_dataset.csv"
)

try:
    raw_vendor_data = pd.read_csv(RAW_DATASET_PATH)
    print(
        "Raw vendor dataset loaded:",
        len(raw_vendor_data),
        "records"
    )
except Exception as exc:
    raw_vendor_data = pd.DataFrame()
    print("Raw vendor dataset unavailable:", exc)


def find_winning_vendor(row):
    """
    Find the real winning vendor from the original dataset.

    We match procurement attributes rather than assuming that
    processed row numbers correspond to raw CSV row numbers.
    """

    if raw_vendor_data.empty:
        return "Vendor information unavailable"

    if "winning_vendor" not in raw_vendor_data.columns:
        return "Vendor information unavailable"

    department = decode_one_hot(row, "department_")
    category = decode_one_hot(row, "category_")
    location = decode_one_hot(row, "location_")

    contract_value = safe_float(
        row_value(row, "final_contract_value", 0)
    )

    estimated_value = safe_float(
        row_value(row, "estimated_value", 0)
    )

    bidders = safe_int(
        row_value(row, "number_of_bidders", 0)
    )

    candidates = raw_vendor_data.copy()

    # Match categorical procurement attributes first.
    for column, value in [
        ("department", department),
        ("category", category),
        ("location", location),
    ]:
        if column in candidates.columns and value:
            candidates = candidates[
                candidates[column]
                .astype(str)
                .str.strip()
                .str.lower()
                == str(value).strip().lower()
            ]

    if candidates.empty:
        return "Vendor information unavailable"

    # Match numeric procurement attributes.
    if "contract_value" in candidates.columns:
        contract_values = pd.to_numeric(
            candidates["contract_value"],
            errors="coerce"
        )

        candidates = candidates[
            (contract_values - contract_value).abs()
            <= max(abs(contract_value) * 0.0001, 1)
        ]

    if candidates.empty:
        return "Vendor information unavailable"

    if "number_of_bidders" in candidates.columns:
        bidder_values = pd.to_numeric(
            candidates["number_of_bidders"],
            errors="coerce"
        )

        bidder_matches = candidates[
            bidder_values == bidders
        ]

        if not bidder_matches.empty:
            candidates = bidder_matches

    if candidates.empty:
        return "Vendor information unavailable"

    vendors = (
        candidates["winning_vendor"]
        .dropna()
        .astype(str)
        .str.strip()
    )

    vendors = [
        vendor
        for vendor in vendors
        if vendor and vendor.lower() != "nan"
    ]

    # Only return a vendor when the match is unambiguous.
    unique_vendors = list(dict.fromkeys(vendors))

    if len(unique_vendors) == 1:
        return unique_vendors[0]

    return "Vendor information unavailable"

# ============================================================
# DASHBOARD
# ============================================================

@app.get("/api/dashboard")
def dashboard_data():
    if analysis_data.empty:
        return {
            "summary": {
                "totalTenders": 0,
                "totalVendors": 0,
                "highPriority": 0,
                "mediumPriority": 0,
                "lowPriority": 0,
                "analyzedTenders": 0,
                "activeSignals": 0,
            },
            "priorityCases": [],
            "recentTenders": [],
            "signalDistribution": [],
        }

    total_tenders = len(analysis_data)

    if not metadata_dataset.empty and "winning_vendor" in metadata_dataset.columns:
        total_vendors = int(metadata_dataset["winning_vendor"].dropna().astype(str).str.strip().nunique())
    else:
        total_vendors = 0

    high = int((analysis_data["investigation_priority"] >= 75).sum())
    medium = int(
        (
            (analysis_data["investigation_priority"] >= 50)
            & (analysis_data["investigation_priority"] < 75)
        ).sum()
    )
    low = int((analysis_data["investigation_priority"] < 50).sum())

    top = analysis_data.sort_values(
        "investigation_priority", ascending=False
    ).head(10)

    priority_cases = []

    for _, row in top.iterrows():
        row_number = safe_int(row_value(row, "_row_number", 0))
        tender_id = tender_id_for_index(row_number)
        signals = row_value(row, "signals", [])
        if not isinstance(signals, list):
            signals = build_signals(row)
        first_signal = (
            signals[0].get("name", "Procurement anomaly signal")
            if signals and isinstance(signals[0], dict)
            else "Procurement anomaly signal"
        )

        priority_cases.append({
            "_id": tender_id,
            "tenderId": tender_id,
            "signal": first_signal,
            "score": safe_float(row_value(row, "investigation_priority", 0)),
            "investigation_priority": safe_float(row_value(row, "investigation_priority", 0)),
            "rawModelScore": safe_float(row_value(row, "raw_model_score", 0)),
            "priority": row_value(row, "priority", "Low"),
            "department": decode_one_hot(row, "department_"),
            "category": decode_one_hot(row, "category_"),
            "location": decode_one_hot(row, "location_"),
            "vendorSpecialization": decode_one_hot(row, "vendor_specialization_"),
            "winningVendor": find_winning_vendor(row),
            "contractValue": safe_float(row_value(row, "final_contract_value", 0)),
            "estimatedValue": safe_float(row_value(row, "estimated_value", 0)),
            "signals": signals,
        })

    # "Recent" means dataset order in this processed dataset.
    recent = analysis_data.head(5)
    recent_tenders = []

    for _, row in recent.iterrows():
        row_number = safe_int(row_value(row, "_row_number", 0))
        tender_id = tender_id_for_index(row_number)

        recent_tenders.append({
            "_id": tender_id,
            "tenderId": tender_id,
            "department": decode_one_hot(row, "department_"),
            "category": decode_one_hot(row, "category_"),
            "location": decode_one_hot(row, "location_"),
            "estimatedValue": safe_float(row_value(row, "estimated_value", 0)),
            "contractValue": safe_float(row_value(row, "final_contract_value", 0)),
            "numberOfBidders": safe_int(row_value(row, "number_of_bidders", 0)),
            "winningVendor": "Vendor record not linked to processed model row",
            "vendorSpecialization": decode_one_hot(row, "vendor_specialization_"),
            "investigation_priority": safe_float(row_value(row, "investigation_priority", 0)),
            "priority": row_value(row, "priority", "Low"),
        })

    signal_counts: dict[str, int] = {}

    for signals in analysis_data["signals"]:
        if not isinstance(signals, list):
            continue

        for signal in signals:
            if not isinstance(signal, dict):
                continue

            name = signal.get("name", "Unknown signal")
            signal_counts[name] = signal_counts.get(name, 0) + 1

    sorted_signals = sorted(
        signal_counts.items(),
        key=lambda item: item[1],
        reverse=True,
    )[:6]

    total_signal_count = sum(signal_counts.values())

    signal_distribution = []

    for name, count in sorted_signals:
        percentage = round((count / total_signal_count) * 100) if total_signal_count else 0
        signal_distribution.append({
            "name": name,
            "count": count,
            "percentage": percentage,
        })

    return {
        "summary": {
            "totalTenders": total_tenders,
            "totalVendors": total_vendors,
            "highPriority": high,
            "mediumPriority": medium,
            "lowPriority": low,
            "analyzedTenders": total_tenders,
            "activeSignals": total_signal_count,
        },
        "priorityCases": priority_cases,
        "recentTenders": recent_tenders,
        "signalDistribution": signal_distribution,
    }


@app.get("/api/dashboard/summary")
def dashboard_summary():
    return dashboard_data()["summary"]


# ============================================================
# TENDERS
# ============================================================

@app.get("/api/tenders")
def get_tenders(limit: int = 20, skip: int = 0):
    limit = min(max(limit, 1), 100)
    skip = max(skip, 0)

    if analysis_data.empty:
        return {
            "items": [],
            "total": 0
        }

    sorted_data = analysis_data.sort_values(
        "investigation_priority",
        ascending=False
    )

    total = len(sorted_data)
    selected = sorted_data.iloc[skip: skip + limit]
    items = []

    for _, row in selected.iterrows():
        row_number = safe_int(row_value(row, "_row_number", 0))
        tender_id = tender_id_for_index(row_number)

        items.append({
            "_id": tender_id,
            "tenderId": tender_id,
            "department": decode_one_hot(row, "department_"),
            "category": decode_one_hot(row, "category_"),
            "location": decode_one_hot(row, "location_"),
            "estimatedValue": safe_float(row_value(row, "estimated_value", 0)),
            "contractValue": safe_float(row_value(row, "final_contract_value", 0)),
            "numberOfBidders": safe_int(row_value(row, "number_of_bidders", 0)),
            "winningVendor": find_winning_vendor(row),
            "vendorSpecialization": decode_one_hot(row, "vendor_specialization_"),
            "investigation_priority": safe_float(row_value(row, "investigation_priority", 0)),
            "priority": row_value(row, "priority", "Low"),
            "rawModelScore": safe_float(row_value(row, "raw_model_score", 0)),
            "signals": row_value(row, "signals", []),
        })

    return {
        "items": items,
        "total": total
    }


@app.get("/api/tenders/{tender_id}")
def get_tender(tender_id: str):
    if analysis_data.empty:
        raise HTTPException(status_code=404, detail="Tender not found")

    if not tender_id.startswith("DATA-"):
        raise HTTPException(status_code=404, detail="Tender not found")

    try:
        row_number = int(tender_id.split("-")[1]) - 1
    except (ValueError, IndexError):
        raise HTTPException(status_code=404, detail="Tender not found")

    matches = analysis_data[
        analysis_data["_row_number"] == row_number
    ]

    if matches.empty:
        raise HTTPException(status_code=404, detail="Tender not found")

    row = matches.iloc[0]

    return tender_payload(row, tender_id)


# ============================================================
# INVESTIGATIONS
# ============================================================

@app.get("/api/investigations")
def get_investigations(
    limit: int = 10,
    skip: int = 0,
    priority: str = "",
    search: str = "",
    sortBy: str = "score",
):
    limit = min(max(limit, 1), 50)
    skip = max(skip, 0)

    if analysis_data.empty:
        return {
            "items": [],
            "total": 0,
            "stats": {"high": 0, "medium": 0, "low": 0, "total": 0},
            "page": 1,
            "limit": limit,
        }

    filtered = analysis_data.copy()

    if priority:
        p = priority.lower()
        if p == "high":
            filtered = filtered[filtered["investigation_priority"] >= 75]
        elif p == "medium":
            filtered = filtered[
                (filtered["investigation_priority"] >= 50)
                & (filtered["investigation_priority"] < 75)
            ]
        elif p == "low":
            filtered = filtered[filtered["investigation_priority"] < 50]

    if search.strip():
        term = search.strip().lower()
        mask = pd.Series(False, index=filtered.index)

        for column in [
            "estimated_value",
            "final_contract_value",
            "number_of_bidders",
        ]:
            if column in filtered.columns:
                mask = mask | filtered[column].astype(str).str.lower().str.contains(term, na=False)

        for prefix in ["department_", "category_", "location_"]:
            for column in filtered.columns:
                if column.startswith(prefix):
                    mask = mask | filtered[column].astype(str).str.contains("1", na=False) & pd.Series([term in column.lower()] * len(filtered), index=filtered.index)

        filtered = filtered[mask]

    high_count = int((analysis_data["investigation_priority"] >= 75).sum())
    medium_count = int(
        (
            (analysis_data["investigation_priority"] >= 50)
            & (analysis_data["investigation_priority"] < 75)
        ).sum()
    )
    low_count = int((analysis_data["investigation_priority"] < 50).sum())

    sort_column = (
        "final_contract_value"
        if sortBy == "value"
        else "investigation_priority"
    )

    filtered = filtered.sort_values(sort_column, ascending=False)
    total = len(filtered)
    selected = filtered.iloc[skip: skip + limit]

    items = []

    for _, row in selected.iterrows():
        row_number = safe_int(row_value(row, "_row_number", 0))
        tender_id = tender_id_for_index(row_number)
        score = safe_float(row_value(row, "investigation_priority", 0))
        signals = row_value(row, "signals", [])

        first_signal = (
            signals[0].get("name", "Procurement anomaly signal")
            if signals and isinstance(signals[0], dict)
            else "Procurement anomaly signal"
        )

        items.append({
            "id": f"INV-{tender_id}",
            "tenderId": tender_id,
            "signal": first_signal,
            "department": decode_one_hot(row, "department_"),
            "category": decode_one_hot(row, "category_"),
            "location": decode_one_hot(row, "location_"),
            "value": safe_float(row_value(row, "final_contract_value", 0)),
            "priority": row_value(row, "priority", get_priority(score)),
            "score": round(score, 2),
            "rawModelScore": safe_float(row_value(row, "raw_model_score", 0)),
            "vendor": "Not available in processed dataset",
        })

    return {
        "items": items,
        "total": total,
        "stats": {
            "high": high_count,
            "medium": medium_count,
            "low": low_count,
            "total": high_count + medium_count + low_count,
        },
        "page": (skip // limit) + 1,
        "limit": limit,
    }


# ============================================================
# EVIDENCE
# ============================================================

@app.get("/api/tenders/{tender_id}/evidence")
def tender_evidence(tender_id: str):
    tender = get_tender(tender_id)

    # Locate the original row.
    row_number = int(tender_id.split("-")[1]) - 1
    row = analysis_data[analysis_data["_row_number"] == row_number].iloc[0]

    signals = row_value(row, "signals", [])
    evidence = []

    field_mapping = {
        "Price deviation": (
            "current_price_vs_comparable_percent",
            "Contract price differs from comparable procurement prices.",
        ),
        "High bid similarity": (
            "bid_similarity_percent",
            "Bid values show a high degree of similarity.",
        ),
        "Repeated participation pattern": (
            "shared_tenders",
            "Vendors repeatedly appear together in procurement events.",
        ),
        "High vendor win concentration": (
            "historical_win_rate",
            "Historical vendor win rate is elevated.",
        ),
        "Strong network relationship": (
            "network_relationship_strength",
            "The record has strong historical network relationships.",
        ),
        "Market price movement": (
            "market_price_increase",
            "Market movement may explain part of the price change.",
        ),
    }

    for signal in signals:
        if not isinstance(signal, dict):
            continue

        name = signal.get("name")
        if name not in field_mapping:
            continue

        field, interpretation = field_mapping[name]

        evidence.append({
            "rawEvidence": {
                "field": field,
                "value": safe_float(row_value(row, field, 0)),
            },
            "derivedSignal": name,
            "interpretation": interpretation,
        })

    tender["evidence"] = evidence
    tender["score"] = tender["investigation_priority"]

    return tender


# ============================================================
# VENDORS
# ============================================================

# ============================================================
# VENDORS
# ============================================================

@app.get("/api/vendors")
def get_vendors(
    limit: int = 10,
    skip: int = 0,
    search: str = "",
):
    limit = min(max(limit, 1), 50)
    skip = max(skip, 0)

    # The processed ML dataset does not contain winning_vendor.
    # Use the original procurement dataset for the vendor directory.
    raw_vendor_path = os.path.join(BASE_DIR, "vigilant_dataset.csv")

    if not os.path.exists(raw_vendor_path):
        return {
            "items": [],
            "total": 0,
            "page": (skip // limit) + 1,
            "limit": limit,
            "note": "Original vendor dataset not found.",
        }

    try:
        vendor_data = pd.read_csv(raw_vendor_path)
    except Exception as exc:
        return {
            "items": [],
            "total": 0,
            "page": (skip // limit) + 1,
            "limit": limit,
            "note": f"Could not load vendor dataset: {exc}",
        }

    if "winning_vendor" not in vendor_data.columns:
        return {
            "items": [],
            "total": 0,
            "page": (skip // limit) + 1,
            "limit": limit,
            "note": "winning_vendor column not found in original dataset.",
        }

    vendor_data["winning_vendor"] = (
        vendor_data["winning_vendor"]
        .astype(str)
        .str.strip()
    )

    vendor_data = vendor_data[
        (vendor_data["winning_vendor"] != "") &
        (vendor_data["winning_vendor"].str.lower() != "nan")
    ]

    # Search vendor name or department.
    if search.strip():
        term = search.strip().lower()

        vendor_mask = (
            vendor_data["winning_vendor"]
            .str.lower()
            .str.contains(term, na=False)
        )

        if "department" in vendor_data.columns:
            department_mask = (
                vendor_data["department"]
                .astype(str)
                .str.lower()
                .str.contains(term, na=False)
            )

            vendor_data = vendor_data[vendor_mask | department_mask]
        else:
            vendor_data = vendor_data[vendor_mask]

    # Aggregate procurement activity by vendor.
    vendor_rows = []

    for vendor_name, group in vendor_data.groupby(
        "winning_vendor",
        dropna=True,
    ):
        vendor_name = str(vendor_name).strip()

        if not vendor_name:
            continue

        if "final_contract_value" in group.columns:
            contract_values = pd.to_numeric(
                group["final_contract_value"],
                errors="coerce",
            ).fillna(0)

            total_value = float(contract_values.sum())
        else:
            total_value = 0.0

        if "department" in group.columns:
            departments = sorted(
                {
                    str(value).strip()
                    for value in group["department"].dropna()
                    if str(value).strip()
                }
            )
        else:
            departments = []

        vendor_rows.append({
            "name": vendor_name,
            "tenders": int(len(group)),
            "awards": int(len(group)),
            "value": total_value,
            "highPriority": 0,
            "departments": departments,
        })

    # Sort by number of tenders, then vendor name.
    vendor_rows.sort(
        key=lambda item: (
            -item["tenders"],
            item["name"].lower(),
        )
    )

    total = len(vendor_rows)

    selected = vendor_rows[
        skip:skip + limit
    ]

    return {
        "items": selected,
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
    }

# ============================================================
# EVIDENCE REPOSITORY
# ============================================================

@app.get("/api/evidence")
def get_evidence(limit: int = 20, skip: int = 0, search: str = ""):
    limit = min(max(limit, 1), 50)
    skip = max(skip, 0)

    if analysis_data.empty:
        return {"items": [], "total": 0, "page": 1, "limit": limit}

    rows = []
    term = search.strip().lower()

    for _, row in analysis_data.iterrows():
        row_number = safe_int(row_value(row, "_row_number", 0))
        tender_id = tender_id_for_index(row_number)
        source_tender_id = str(metadata_value(row_number, "tender_id", tender_id))
        vendor = "Source vendor not linked to processed model row"
        score = safe_float(row_value(row, "investigation_priority", 0))
        priority = str(row_value(row, "priority", get_priority(score)))
        signals = row_value(row, "signals", [])
        if not isinstance(signals, list):
            signals = build_signals(row)

        for signal in signals:
            if not isinstance(signal, dict):
                continue

            name = str(signal.get("name", "Procurement signal"))
            field_map = {
                "Price deviation": "current_price_vs_comparable_percent",
                "High bid similarity": "bid_similarity_percent",
                "Repeated participation pattern": "shared_tenders",
                "High vendor win concentration": "historical_win_rate",
                "Strong network relationship": "network_relationship_strength",
                "Market price movement": "market_price_increase",
            }
            field = field_map.get(name, "")
            value = safe_float(row_value(row, field, 0)) if field else safe_float(signal.get("value", 0))
            unit = str(signal.get("unit", ""))

            haystack = " ".join([
                tender_id,
                source_tender_id,
                vendor,
                name,
                str(row_number),
            ]).lower()

            if term and term not in haystack:
                continue

            rows.append({
                "id": f"EVD-{row_number + 1:05d}-{len(rows) + 1:02d}",
                "tenderId": tender_id,
                "sourceTenderId": source_tender_id,
                "vendor": vendor,
                "signal": name,
                "field": field,
                "value": value,
                "unit": unit,
                "priority": priority,
                "score": score,
                "interpretation": str(signal.get("description", "Derived from available procurement features.")),
            })

    # Highest-priority evidence first.
    rows.sort(key=lambda item: item["score"], reverse=True)
    total = len(rows)

    return {
        "items": rows[skip:skip + limit],
        "total": total,
        "page": (skip // limit) + 1,
        "limit": limit,
    }

