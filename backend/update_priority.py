from database import tenders_collection

tenders = list(
    tenders_collection.find().sort(
        "investigation_priority", -1
    )
)

high_cutoff = tenders[249]["investigation_priority"]
medium_cutoff = tenders[999]["investigation_priority"]

for tender in tenders:
    score = tender["investigation_priority"]

    if score >= high_cutoff:
        priority = "High"
    elif score >= medium_cutoff:
        priority = "Medium"
    else:
        priority = "Low"

    tenders_collection.update_one(
        {"_id": tender["_id"]},
        {"$set": {"priority": priority}}
    )

print("Updated:", len(tenders))
print("High cutoff:", high_cutoff)
print("Medium cutoff:", medium_cutoff)
