import httpx
import re
from bs4 import BeautifulSoup
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Any
from app.tasks.scrapers.location_filter import is_bangalore_or_online

DEVPOST_API_URLS = [
    # 1. Online open and upcoming hackathons (e.g., Amazon, Nebius, PayPal, OpenCV)
    "https://devpost.com/api/hackathons?challenge_type[]=online&status[]=open&status[]=upcoming",
    # 2. Bangalore physical/in-person and hybrid hackathons
    "https://devpost.com/api/hackathons?search=bangalore&status[]=open&status[]=upcoming",
]

def parse_devpost_deadline(period_str: str, time_left_str: str) -> datetime:
    """
    Parses deadline from Devpost's submission_period_dates (e.g. 'Aug 31 - Oct 23, 2026')
    or time_left_to_submission (e.g. '19 days left', 'about 1 month left').
    """
    now = datetime.now(timezone.utc)
    # Attempt 1: Parse end date from period_str (e.g. 'Oct 23, 2026')
    if period_str and " - " in period_str:
        end_part = period_str.split(" - ")[-1].strip()
        # Common formats: 'Oct 23, 2026', '23 Oct 2026', 'November 12, 2026'
        for fmt in ["%b %d, %Y", "%B %d, %Y", "%d %b %Y", "%d %B %Y"]:
            try:
                dt = datetime.strptime(end_part, fmt).replace(tzinfo=timezone.utc)
                if dt > now:
                    return dt
            except Exception:
                pass

    # Attempt 2: Parse time_left_str (e.g. '19 days left', '25 days left')
    if time_left_str:
        days_match = re.search(r"(\d+)\s+days?\s+left", time_left_str, re.I)
        if days_match:
            return now + timedelta(days=int(days_match.group(1)))
        months_match = re.search(r"(\d+)\s+months?\s+left", time_left_str, re.I)
        if months_match:
            return now + timedelta(days=int(months_match.group(1)) * 30)
        if "1 month left" in time_left_str.lower():
            return now + timedelta(days=30)
        hours_match = re.search(r"(\d+)\s+hours?\s+left", time_left_str, re.I)
        if hours_match:
            return now + timedelta(hours=int(hours_match.group(1)))

    return now + timedelta(days=30)

async def scrape_devpost_hackathons() -> List[Dict[str, Any]]:
    """
    Scrapes real-world active and upcoming hackathons directly from Devpost's search API.
    Captures exact titles, deep links, prize pools, submission deadlines, and location filters.
    """
    events: List[Dict[str, Any]] = []
    seen_urls = set()
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
    }

    async with httpx.AsyncClient(headers=headers, timeout=12.0, follow_redirects=True) as client:
        for api_url in DEVPOST_API_URLS:
            try:
                resp = await client.get(api_url)
                if resp.status_code != 200:
                    continue
                data = resp.json()
                raw_hackathons = data.get("hackathons", [])

                for item in raw_hackathons:
                    link = item.get("url", "").strip()
                    if not link or link in seen_urls:
                        continue
                    seen_urls.add(link)

                    title = item.get("title", "").strip()
                    if not title or len(title) < 3:
                        continue

                    # Clean prize amount
                    raw_prize = item.get("prize_amount", "")
                    if raw_prize:
                        prize_clean = BeautifulSoup(raw_prize, "html.parser").get_text(strip=True)
                    else:
                        prize_clean = "Prizes & Recognition"

                    # Location extraction
                    loc_obj = item.get("displayed_location", {})
                    loc_text = loc_obj.get("location", "Online") if isinstance(loc_obj, dict) else "Online"
                    
                    is_online = (
                        "online" in loc_text.lower() or 
                        "virtual" in loc_text.lower() or 
                        loc_obj.get("icon") == "globe"
                    )
                    mode = "Online" if is_online else "In-Person"

                    # Filter for Bangalore within ~50km OR Online
                    if not is_bangalore_or_online(location=loc_text, mode=mode, text=f"{title} {loc_text}"):
                        continue

                    # Deadline calculation
                    period = item.get("submission_period_dates", "")
                    time_left = item.get("time_left_to_submission", "")
                    deadline = parse_devpost_deadline(period, time_left)

                    # Skip if already ended
                    if deadline < datetime.now(timezone.utc):
                        continue

                    themes = [t.get("name") for t in item.get("themes", []) if isinstance(t, dict) and t.get("name")]
                    tags = ["Devpost", "Hackathon"] + themes[:3]

                    desc = (
                        f"Compete in '{title}'. Submission period: {period} ({time_left}). "
                        f"Themes: {', '.join(themes[:3]) if themes else 'General Tech & AI'}."
                    )

                    events.append({
                        "title": title[:150],
                        "description": desc[:500],
                        "type": "hackathon",
                        "organizer": item.get("organization_name") or "Devpost & Sponsors",
                        "deadline": deadline,
                        "location": loc_text,
                        "external_link": link,
                        "prize_pool": prize_clean,
                        "mode": mode,
                        "team_size": "1-4 Members",
                        "tags": tags
                    })
            except Exception as e:
                print(f"[Devpost Scraper] Notice for {api_url}: {e}")

    return events
