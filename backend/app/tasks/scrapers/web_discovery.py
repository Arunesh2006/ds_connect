import re
import json
import httpx
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse, urljoin
from app.tasks.scrapers.location_filter import is_bangalore_or_online

DISCOVERY_SOURCES = [
    # NASA Open Science & Space Apps Challenge
    "https://www.spaceappschallenge.org",
    # DrivenData Data Science for Social Good Competitions
    "https://www.drivendata.org/competitions/",
    # Devpost AI & Data Science Hub
    "https://devpost.com/hackathons?challenge_type[]=online&status[]=open&search=machine+learning",
]

def clean_url(url: str) -> str:
    """Removes marketing query tracking parameters to normalize URLs."""
    parsed = urlparse(url)
    clean_query = "&".join(
        q for q in parsed.query.split("&")
        if q and not any(q.lower().startswith(p) for p in ["utm_", "ref=", "fbclid=", "gclid="])
    )
    return parsed._replace(query=clean_query, fragment="").geturl()

async def extract_structured_opportunity_from_url(url: str, client: httpx.AsyncClient) -> Optional[Dict[str, Any]]:
    """
    Autonomously inspects an opportunity webpage:
    1. Extracts JSON-LD schema (schema.org/Event or JobPosting)
    2. Fallback to OpenGraph metadata
    3. Fallback to heuristic DOM regex parsing
    4. Filters out expired events and enforces Bangalore / Online location boundaries.
    """
    now = datetime.now(timezone.utc)
    try:
        resp = await client.get(url, timeout=12.0, follow_redirects=True)
        if resp.status_code != 200:
            return None

        soup = BeautifulSoup(resp.content, "html.parser")
        
        # 1. Attempt JSON-LD schema extraction
        json_lds = soup.find_all("script", type="application/ld+json")
        for tag in json_lds:
            try:
                if not tag.string:
                    continue
                data = json.loads(tag.string)
                items = data if isinstance(data, list) else data.get("@graph", [data]) if isinstance(data, dict) else []

                for item in items:
                    item_type = item.get("@type", "")
                    if item_type in ("Event", "Hackathon", "JobPosting", "EducationEvent"):
                        title = item.get("name") or item.get("title")
                        desc = item.get("description") or ""
                        organizer = "Community Platform"
                        if isinstance(item.get("organizer"), dict):
                            organizer = item["organizer"].get("name", organizer)
                        elif isinstance(item.get("hiringOrganization"), dict):
                            organizer = item["hiringOrganization"].get("name", organizer)

                        deadline = None
                        end_raw = item.get("endDate") or item.get("validThrough")
                        if end_raw:
                            try:
                                deadline = datetime.fromisoformat(end_raw.replace("Z", "+00:00"))
                            except Exception:
                                deadline = None

                        # Discard completed/ended events
                        if deadline and deadline <= now:
                            continue

                        if not deadline:
                            deadline = now + timedelta(days=35)

                        # Detect location and mode from JSON-LD
                        mode = "Online"
                        location = "Online"
                        loc_obj = item.get("location")
                        if isinstance(loc_obj, dict):
                            address = loc_obj.get("address", {})
                            if isinstance(address, dict):
                                location = address.get("addressLocality") or address.get("streetAddress") or "In-Person"
                            elif isinstance(address, str):
                                location = address
                        
                        attendance_mode = item.get("eventAttendanceMode", "")
                        if "Online" in attendance_mode:
                            mode = "Online"
                        elif "Mixed" in attendance_mode:
                            mode = "Hybrid"
                        elif "Offline" in attendance_mode:
                            mode = "In-Person"

                        # Location filter check
                        if not is_bangalore_or_online(location=location, mode=mode, text=f"{title} {desc} {location}"):
                            continue

                        if title:
                            return {
                                "title": title[:150].strip(),
                                "description": BeautifulSoup(desc, "html.parser").get_text()[:500].strip(),
                                "type": "hackathon" if "event" in item_type.lower() else "internship",
                                "organizer": organizer,
                                "deadline": deadline,
                                "location": location,
                                "external_link": clean_url(url),
                                "prize_pool": "$25,000 USD",
                                "mode": mode,
                                "team_size": "1-4 Members",
                                "tags": ["AI/ML", "Hackathon", "Auto-Discovered"]
                            }
            except Exception:
                continue

        # 2. Fallback to OpenGraph & Twitter Cards
        og_title = soup.find("meta", property="og:title")
        og_desc = soup.find("meta", property="og:description")
        og_site = soup.find("meta", property="og:site_name")

        title = og_title["content"].strip() if og_title and og_title.get("content") else None
        if not title and soup.title:
            title = soup.title.string.strip() if soup.title.string else None

        desc = og_desc["content"].strip() if og_desc and og_desc.get("content") else ""
        if not desc:
            p = soup.find("p")
            desc = p.get_text().strip() if p else "Competitive data science and hackathon challenge."

        organizer = og_site["content"].strip() if og_site and og_site.get("content") else urlparse(url).netloc

        bot_block_indicators = [
            "404", "not found", "login", "sign in", "recaptcha",
            "checking your browser", "just a moment", "attention required",
            "cloudflare", "security check", "robot or human"
        ]
        if title and len(title) > 5 and not any(skip in title.lower() for skip in bot_block_indicators):
            full_text = f"{title} {desc} {soup.get_text()[:1000]}"
            
            # Detect in-person vs online
            is_virtual = bool(re.search(r"\b(virtual|online|global|digital|remote|worldwide)\b", full_text, re.I))
            mode = "Online" if is_virtual else "In-Person"
            location = "Online" if is_virtual else "In-Person"

            # Strictly check location
            if not is_bangalore_or_online(location=location, mode=mode, text=full_text):
                return None

            deadline = now + timedelta(days=35)
            date_match = re.search(r"(\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b)", full_text, re.IGNORECASE)
            if date_match:
                try:
                    parsed_dt = datetime.strptime(date_match.group(1), "%d %b %Y").replace(tzinfo=timezone.utc)
                    if parsed_dt > now:
                        deadline = parsed_dt
                except Exception:
                    pass

            return {
                "title": title[:150],
                "description": desc[:500],
                "type": "hackathon",
                "organizer": organizer,
                "deadline": deadline,
                "location": location,
                "external_link": clean_url(url),
                "prize_pool": "Prizes & Recognition",
                "mode": mode,
                "team_size": "1-4 Members",
                "tags": ["Auto-Discovered", "Data Science", "Competition"]
            }
    except Exception as e:
        print(f"[Discovery Extractor] Notice for {url}: {e}")

    return None

async def discover_new_opportunities(target_urls: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Autonomously crawls discovery seed endpoints, extracts opportunities,
    and returns a structured list of opportunity records.
    """
    discovered: List[Dict[str, Any]] = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9"
    }

    seeds = list(DISCOVERY_SOURCES)
    if target_urls:
        seeds.extend(target_urls)

    # Note: verify=False allows bypassing Windows local CA certificate store mismatches
    async with httpx.AsyncClient(headers=headers, timeout=12.0, follow_redirects=True, verify=False) as client:
        for url in seeds:
            opp = await extract_structured_opportunity_from_url(url, client)
            if opp:
                discovered.append(opp)

    return discovered
