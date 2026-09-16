import random
import math
from datetime import datetime, timedelta

from database import (
    tenders_collection,
    vendors_collection,
    analyses_collection
)


# ============================================================
# CONFIGURATION
# ============================================================

NUM_VENDORS = 1500
NUM_TENDERS = 5000

random.seed(42)


# ============================================================
# REFERENCE DATA
# ============================================================

DEPARTMENTS = [
    "Public Works Department",
    "Rural Development Department",
    "Urban Development Department",
    "Water Resources Department"
]

CATEGORIES = [
    "Consulting",
    "Equipment Supply",
    "Healthcare",
    "IT Services",
    "Infrastructure",
    "Road construction"
]

LOCATIONS = [
    "Belagavi",
    "Bengaluru",
    "Davangere",
    "Hubballi",
    "Mangaluru",
    "Mysuru",
    "Shivamogga",
    "Tumakuru",
    "Udupi"
]

SPECIALIZATIONS = [
    "Consulting",
    "Equipment Supply",
    "Healthcare",
    "IT Services",
    "Infrastructure"
]


# ============================================================
# VENDOR GENERATION
# ============================================================

def generate_vendors():

    vendors = []

    for i in range(NUM_VENDORS):

        vendor_id = f"VEN-{i + 1:04d}"

        specialization = random.choice(SPECIALIZATIONS)

        previous_tenders = random.randint(5, 100)

        # Generate a realistic historical win rate
        win_rate = random.betavariate(5, 4)

        previous_wins = max(
            0,
            min(
                previous_tenders,
                round(previous_tenders * win_rate)
            )
        )

        actual_win_rate = (
            previous_wins / previous_tenders * 100
            if previous_tenders > 0
            else 0
        )

        vendor = {
            "vendorId": vendor_id,
            "vendorName": f"{specialization} Solutions Pvt Ltd {i + 1}",
            "specialization": specialization,
            "location": random.choice(LOCATIONS),
            "previousTenders": previous_tenders,
            "previousWins": previous_wins,
            "historicalWinRate": round(actual_win_rate, 2),
            "registrationDate": (
                datetime.now() -
                timedelta(days=random.randint(300, 4000))
            )
        }

        vendors.append(vendor)

    return vendors


# ============================================================
# PRICE GENERATION
# ============================================================

def generate_estimated_value():

    # Log-normal distribution gives realistic procurement values
    value = random.lognormvariate(
        math.log(50_000_000),
        0.8
    )

    return round(
        max(500_000, min(value, 500_000_000)),
        2
    )


def generate_bids(estimated_value, number_of_bidders):

    bids = []

    base_factor = random.uniform(0.92, 1.08)

    for _ in range(number_of_bidders):

        variation = random.uniform(
            -0.05,
            0.08
        )

        bid = (
            estimated_value *
            base_factor *
            (1 + variation)
        )

        bids.append(round(bid, 2))

    bids.sort()

    return bids


# ============================================================
# TENDER GENERATION
# ============================================================

def generate_tender(index, vendors):

    tender_id = f"TDR-{10000 + index}"

    department = random.choice(DEPARTMENTS)
    category = random.choice(CATEGORIES)
    location = random.choice(LOCATIONS)

    estimated_value = generate_estimated_value()

    # Most tenders have normal competition
    number_of_bidders = random.randint(3, 10)

    selected_vendors = random.sample(
        vendors,
        min(number_of_bidders, len(vendors))
    )

    bids = generate_bids(
        estimated_value,
        number_of_bidders
    )

    winner_index = 0

    # Occasionally create unusual pricing
    suspicious_price_pattern = random.random() < 0.12

    if suspicious_price_pattern:

        # Winner can be noticeably above the estimate
        winning_bid = estimated_value * random.uniform(
            1.10,
            1.30
        )

        bids[0] = round(winning_bid, 2)

        bids.sort()

    winning_vendor = selected_vendors[winner_index]

    contract_value = bids[0]

    # --------------------------------------------------------
    # Vendor history
    # --------------------------------------------------------

    previous_tenders = winning_vendor["previousTenders"]
    previous_wins = winning_vendor["previousWins"]

    historical_win_rate = winning_vendor["historicalWinRate"]

    # --------------------------------------------------------
    # Specialization
    # --------------------------------------------------------

    is_specialized = int(
        winning_vendor["specialization"].lower()
        in category.lower()
        or
        category.lower()
        in winning_vendor["specialization"].lower()
    )

    # --------------------------------------------------------
    # Bid behaviour
    # --------------------------------------------------------

    vendor_a_bid = bids[0]

    vendor_b_bid = (
        bids[1]
        if len(bids) > 1
        else bids[0]
    )

    vendor_c_bid = (
        bids[2]
        if len(bids) > 2
        else bids[-1]
    )

    # Bid similarity
    mean_bid = sum(bids) / len(bids)

    bid_differences = [
        abs(bid - mean_bid) / mean_bid * 100
        for bid in bids
    ]

    similarity = max(
        0,
        100 - sum(bid_differences) / len(bid_differences)
    )

    # --------------------------------------------------------
    # Comparable procurement context
    # --------------------------------------------------------

    comparable_tenders = random.randint(5, 30)

    average_comparable_price = (
        estimated_value *
        random.uniform(0.90, 1.08)
    )

    current_price_vs_comparable = (
        (
            contract_value -
            average_comparable_price
        )
        /
        average_comparable_price
    ) * 100

    regional_price_variation = random.uniform(
        1,
        12
    )

    market_price_increase = random.uniform(
        0,
        15
    )

    # --------------------------------------------------------
    # Network behaviour
    # --------------------------------------------------------

    shared_tenders = random.randint(
        0,
        20
    )

    network_relationship_strength = (
        min(
            1,
            shared_tenders / 20 +
            random.uniform(0, 0.15)
        )
    )

    # --------------------------------------------------------
    # Repeated participation
    # --------------------------------------------------------

    repeated_participation = int(
        random.random() < 0.18
    )

    # --------------------------------------------------------
    # Comparable wins
    # --------------------------------------------------------

    a_won_comparable_tenders = random.randint(
        0,
        min(previous_wins, 15)
    )

    # --------------------------------------------------------
    # Explanation variables
    # --------------------------------------------------------

    price_deviation = (
        current_price_vs_comparable
    )

    price_dev_unexplained = max(
        0,
        price_deviation -
        market_price_increase
    )

    price_dev_explained_by_market = min(
        abs(price_deviation),
        market_price_increase
    )

    winrate_unexplained = 0

    if historical_win_rate > 80:
        if previous_tenders >= 20:
            winrate_unexplained = random.uniform(
                0,
                10
            )

    bid_similarity_unexplained = 0

    if similarity > 90:
        bid_similarity_unexplained = random.uniform(
            0,
            15
        )

    # ========================================================
    # STORE RAW TENDER
    # ========================================================

    tender = {
        "tenderId": tender_id,

        "department": department,
        "category": category,
        "location": location,

        "estimatedValue": round(
            estimated_value,
            2
        ),

        "contractValue": round(
            contract_value,
            2
        ),

        "numberOfBidders": number_of_bidders,

        "winningVendor": winning_vendor[
            "vendorName"
        ],

        "winningVendorId": winning_vendor[
            "vendorId"
        ],

        "vendorSpecialization": winning_vendor[
            "specialization"
        ],

        "procurementMethod": random.choice([
            "Open Tender",
            "Limited Tender",
            "Request for Proposal"
        ]),

        "publicationDate": (
            datetime.now() -
            timedelta(days=random.randint(1, 900))
        ),

        # ----------------------------------------------------
        # MODEL FEATURES
        # ----------------------------------------------------

        "modelFeatures": {

            "estimated_value":
                estimated_value,

            "final_contract_value":
                contract_value,

            "number_of_bidders":
                number_of_bidders,

            "is_specialized_for_tender":
                is_specialized,

            "historical_win_rate":
                historical_win_rate,

            "previous_tenders":
                previous_tenders,

            "previous_wins":
                previous_wins,

            "vendor_a_bid":
                vendor_a_bid,

            "vendor_b_bid":
                vendor_b_bid,

            "vendor_c_bid":
                vendor_c_bid,

            "bid_similarity_percent":
                round(similarity, 2),

            "a_won_comparable_tenders":
                a_won_comparable_tenders,

            "b_c_repeatedly_participated":
                repeated_participation,

            "comparable_tenders":
                comparable_tenders,

            "average_comparable_price":
                round(
                    average_comparable_price,
                    2
                ),

            "current_price_vs_comparable_percent":
                round(
                    current_price_vs_comparable,
                    2
                ),

            "network_relationship_strength":
                round(
                    network_relationship_strength,
                    3
                ),

            "shared_tenders":
                shared_tenders,

            "regional_price_variation":
                round(
                    regional_price_variation,
                    2
                ),

            "market_price_increase":
                round(
                    market_price_increase,
                    2
                ),

            "price_dev_unexplained":
                round(
                    price_dev_unexplained,
                    2
                ),

            "price_dev_explained_by_market":
                round(
                    price_dev_explained_by_market,
                    2
                ),

            "winrate_unexplained":
                round(
                    winrate_unexplained,
                    2
                ),

            "bid_similarity_unexplained":
                round(
                    bid_similarity_unexplained,
                    2
                )
        }
    }

    return tender


# ============================================================
# MAIN
# ============================================================

def main():

    print()
    print("=" * 60)
    print("VIGILANT DATABASE SEEDER")
    print("=" * 60)
    print()

    print("Clearing existing demo data...")

    tenders_collection.delete_many({})
    vendors_collection.delete_many({})
    analyses_collection.delete_many({})

    print("Generating vendors...")

    vendors = generate_vendors()

    vendors_collection.insert_many(
        vendors
    )

    print(
        f"Inserted {len(vendors)} vendors."
    )

    print()
    print("Generating tenders...")

    tenders = []

    for i in range(NUM_TENDERS):

        tender = generate_tender(
            i,
            vendors
        )

        tenders.append(tender)

        if (i + 1) % 500 == 0:
            print(
                f"Generated {i + 1}/{NUM_TENDERS} tenders..."
            )

    tenders_collection.insert_many(
        tenders
    )

    print()
    print(
        f"Inserted {len(tenders)} tenders."
    )

    print()
    print("=" * 60)
    print("DATABASE SEED COMPLETE")
    print("=" * 60)
    print()

    print(
        f"Vendors: {len(vendors)}"
    )

    print(
        f"Tenders: {len(tenders)}"
    )

    print()
    print(
        "The raw procurement dataset is now in MongoDB."
    )

    print()


if __name__ == "__main__":
    main()