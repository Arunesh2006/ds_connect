import re
from typing import Optional

# Bangalore metropolitan area and ~50km radius locations
BANGALORE_REGION_KEYWORDS = [
    "bangalore", "bengaluru", "blr",
    "whitefield", "electronic city", "electronics city",
    "koramangala", "indiranagar", "yelahanka", "marathahalli",
    "hsr layout", "bellandur", "jayanagar", "hebbal",
    "manyata", "sarjapur", "bannerghatta", "mysore road",
    "peenya", "bidadi", "hosur", "devanahalli", "nelamangala",
    "ramanagara", "kanakapura", "doddaballapura", "kengeri",
    "kalyan nagar", "rajajinagar", "malleswaram", "btm layout",
    "bommasandra", "attibele", "jigani", "channapatna", "magadi"
]

ONLINE_DIGITAL_KEYWORDS = [
    "online", "virtual", "remote", "digital",
    "global", "worldwide", "everywhere", "web-based", "hybrid"
]

def is_bangalore_or_online(
    location: Optional[str] = None,
    mode: Optional[str] = None,
    text: Optional[str] = None
) -> bool:
    """
    Strict filter ensuring an event is either:
    1. Fully Online / Digital / Virtual / Remote / Hybrid
    2. Located in Bangalore or within a ~50km range (Electronic City, Whitefield, Hosur, Ramanagara, etc.)
    
    Rejects any in-person events located outside this radius (e.g., US, Europe, Delhi, Mumbai, Hyderabad).
    """
    loc_lower = (location or "").lower().strip()
    mode_lower = (mode or "").lower().strip()
    text_lower = (text or "").lower()

    # 1. Check if event is online, virtual, remote, or hybrid
    if any(keyword in mode_lower for keyword in ONLINE_DIGITAL_KEYWORDS):
        return True
    if any(keyword in loc_lower for keyword in ONLINE_DIGITAL_KEYWORDS):
        return True

    # 2. Check if in-person location matches Bangalore or ~50km range
    for b_keyword in BANGALORE_REGION_KEYWORDS:
        # Match whole word or keyword boundary
        if re.search(rf"\b{re.escape(b_keyword)}\b", loc_lower):
            return True
        if re.search(rf"\b{re.escape(b_keyword)}\b", text_lower):
            return True

    # If it is an in-person event and not in Bangalore ~50km radius, reject it
    return False
