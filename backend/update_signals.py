from database import tenders_collection

def generate_signals(features):
    signals = []

    price = features.get("current_price_vs_comparable_percent", 0)
    price_unexplained = features.get("price_dev_unexplained", 0)

    if price >= 10 or price_unexplained >= 5:
        signals.append({
            "name": "Price deviation",
            "value": round(max(price, price_unexplained), 2),
            "unit": "%"
        })

    bid_similarity = features.get("bid_similarity_percent", 0)

    if bid_similarity >= 90:
        signals.append({
            "name": "High bid similarity",
            "value": round(bid_similarity, 2),
            "unit": "%"
        })

    repeated = features.get("repeated_participation_count", 0)
    shared = features.get("shared_tenders", 0)

    if repeated > 0 or shared >= 10:
        signals.append({
            "name": "Repeated participation pattern",
            "value": int(max(repeated, shared)),
            "unit": "shared tenders"
        })

    win_rate = features.get("historical_win_rate", 0)
    previous_wins = features.get("previous_wins", 0)

    if win_rate >= 75 and previous_wins >= 10:
        signals.append({
            "name": "High vendor win concentration",
            "value": round(win_rate, 2),
            "unit": "%"
        })

    network = features.get("network_relationship_strength", 0)

    if network >= 0.75:
        signals.append({
            "name": "Strong network relationship",
            "value": round(network, 3),
            "unit": "strength"
        })

    market = features.get("market_price_increase", 0)

    if market >= 10:
        signals.append({
            "name": "Market price movement",
            "value": round(market, 2),
            "unit": "%"
        })

    if not signals:
        signals.append({
            "name": "No major derived signal",
            "value": 0,
            "unit": ""
        })

    return signals


count = 0

for tender in tenders_collection.find({}, {"_id": 1, "modelFeatures": 1}):
    features = tender.get("modelFeatures", {})
    signals = generate_signals(features)

    tenders_collection.update_one(
        {"_id": tender["_id"]},
        {"$set": {"signals": signals}}
    )

    count += 1

print(f"Updated signals for {count} tenders.")

pipeline = [
    {"$unwind": "$signals"},
    {"$group": {"_id": "$signals.name", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
]

print("\nSIGNAL COUNTS:")
for item in tenders_collection.aggregate(pipeline):
    print(item["_id"], ":", item["count"])
