import httpx
import re
from bs4 import BeautifulSoup
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.tasks.scrapers.location_filter import is_bangalore_or_online

MLH_SEASONS = [
    # Active current season (Fall 2026 - Summer 2027)
    "https://www.mlh.com/seasons/2027/events",
    # Previous season check for any ongoing/upcoming stragglers
    "https://www.mlh.com/seasons/2026/events",
]

async def scrape_mlh_hackathons() -> List[Dict[str, Any]]:
    """
    Scrapes live upcoming and ongoing student hackathons from Major League Hacking (MLH).
    Extracts structured schema.org/Event metadata, validates future end dates (strictly discarding
    ended hackathons), and enforces the Bangalore / Online location requirement.
    """
    events: List[Dict[str, Any]] = []
    seen_links = set()
    now = datetime.now(timezone.utc)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    }

    async with httpx.AsyncClient(headers=headers, timeout=12.0, follow_redirects=True) as client:
        for season_url in MLH_SEASONS:
            try:
                resp = await client.get(season_url)
                if resp.status_code != 200:
                    continue

                soup = BeautifulSoup(resp.text, "html.parser")
                schema_events = soup.find_all(attrs={"itemtype": "https://schema.org/Event"})

                for ev in schema_events:
                    # 1. Check end date strictly to eliminate ended events
                    end_tag = ev.find(attrs={"itemprop": "endDate"})
                    if not end_tag or not end_tag.get("content"):
                        continue

                    try:
                        end_dt = datetime.fromisoformat(end_tag["content"].replace("Z", "+00:00"))
                    except Exception:
                        continue

                    # STRICT STATUS FILTER: Discard any hackathon that has already concluded
                    if end_dt <= now:
                        continue

                    # 2. Extract Event Destination URL
                    url_tag = ev.find(attrs={"itemprop": "url"}) or ev.get("href")
                    if isinstance(url_tag, str):
                        link = url_tag
                    elif url_tag and hasattr(url_tag, "get"):
                        link = url_tag.get("content") or url_tag.get("href", "")
                    else:
                        link = ""

                    clean_link = link.split("?")[0] if "?" in link else link
                    if not clean_link or clean_link in seen_links:
                        continue
                    seen_links.add(clean_link)

                    # 3. Extract Title
                    title = ""
                    # Priority 1: utm_content query parameter
                    import urllib.parse
                    utm_match = re.search(r"utm_content=([^&]+)", link)
                    if utm_match:
                        title = urllib.parse.unquote_plus(utm_match.group(1)).strip()

                    # Priority 2: h3 or card heading
                    if not title or title.lower() in ["dev", "for businesses", "attend"]:
                        h_tag = ev.find(["h3", "h2", "h4"])
                        if h_tag:
                            title = h_tag.get_text(strip=True)

                    # Priority 3: Fallback from card texts (skip city header)
                    if not title:
                        card_texts = [
                            t.get_text(strip=True)
                            for t in ev.find_all(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"])
                            if t.get_text(strip=True)
                        ]
                        for cand in card_texts:
                            if ("," not in cand and 
                                not re.match(r"^[A-Z]{3}\s+\d{1,2}", cand) and 
                                cand.lower() not in ["in-person", "digital", "hybrid", "online"] and
                                len(cand) > 2):
                                title = cand
                                break
                    
                    if not title or len(title) < 2:
                        name_tag = ev.find(attrs={"itemprop": "name"})
                        title = name_tag.get("content") if name_tag else "MLH Student Hackathon"

                    # 4. Extract Attendance Mode & Location
                    mode_tag = ev.find(attrs={"itemprop": "eventAttendanceMode"})
                    mode_content = mode_tag.get("content", "") if mode_tag else ""

                    is_online = (
                        "Online" in mode_content or 
                        "Mixed" in mode_content or 
                        any(w in ev.get_text().lower() for w in ["digital", "online", "virtual"])
                    )
                    mode = "Hybrid" if "Mixed" in mode_content else ("Online" if is_online else "In-Person")

                    loc_tag = ev.find(attrs={"itemprop": "location"})
                    location_text = loc_tag.get_text(strip=True) if loc_tag else ("Online" if is_online else "In-Person / Campus")

                    # 5. STRICT BANGALORE (<50km) OR ONLINE FILTER
                    if not is_bangalore_or_online(location=location_text, mode=mode, text=f"{title} {location_text} {ev.get_text()}"):
                        continue

                    events.append({
                        "title": title[:150],
                        "description": f"Official MLH Season Hackathon: {title}. Mode: {mode}. Location: {location_text}. Connect with mentors, build innovative projects, and win sponsor prizes.",
                        "type": "hackathon",
                        "organizer": "Major League Hacking (MLH)",
                        "deadline": end_dt,
                        "location": location_text if mode == "In-Person" else "Online",
                        "external_link": clean_link,
                        "prize_pool": "$20,000+ USD in Category Prizes",
                        "mode": mode,
                        "team_size": "2-4 Members",
                        "tags": ["MLH", "Hackathon", "Open Source", "Student Community"]
                    })
            except Exception as e:
                print(f"[MLH Scraper] Notice for {season_url}: {e}")

    return events
