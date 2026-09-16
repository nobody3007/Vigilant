from database import tenders_collection

recent = list(
    tenders_collection.find(
        {},
        {
            "_id": 1,
            "tenderId": 1,
            "department": 1,
            "category": 1,
            "location": 1,
            "estimatedValue": 1,
            "contractValue": 1,
            "numberOfBidders": 1,
            "winningVendor": 1,
            "investigation_priority": 1,
            "priority": 1,
            "signals": 1,
        }
    )
    .sort("_id", -1)
    .limit(5)
)

for tender in recent:
    tender["_id"] = str(tender["_id"])

print(recent)
