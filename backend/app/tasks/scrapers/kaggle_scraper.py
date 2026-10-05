import asyncio
import json
import urllib.request
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.tasks.scrapers.location_filter import is_bangalore_or_online

KAGGLE_RPC_URL = "https://www.kaggle.com/api/i/competitions.CompetitionService/ListCompetitions"

def _fetch_kaggle_competitions_sync() -> List[Dict[str, Any]]:
    """Synchronous fetch using urllib which reliably avoids bot challenge pages."""
    req = urllib.request.Request(
        KAGGLE_RPC_URL,
        data=json.dumps({"pageSize": 150}).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json, text/plain, */*"
        }
    )
    with urllib.request.urlopen(req, timeout=12.0) as resp:
        content = resp.read().decode("utf-8")
        data = json.loads(content)
        return data.get("competitions", [])

async def scrape_kaggle_competitions() -> List[Dict[str, Any]]:
    """
    Fetches live, active Data Science and Machine Learning competitions from Kaggle.
    Extracts real active competitions (Gemma 4 Developer Agent, Enveda CASMI, RSNA, ARC Prize, etc.)
    with direct deep links, exact cash prizes, and future deadlines.
    """
    events: List[Dict[str, Any]] = []
    now = datetime.now(timezone.utc)
    raw_competitions: List[Dict[str, Any]] = []

    try:
        # Run sync fetch in default asyncio thread executor to remain fully non-blocking
        loop = asyncio.get_running_loop()
        raw_competitions = await loop.run_in_executor(None, _fetch_kaggle_competitions_sync)
    except Exception as e:
        print(f"[Kaggle Scraper] Notice: {e}")

    for comp in raw_competitions:
        title = comp.get("title", "").strip()
        slug = comp.get("competitionName", "").strip()
        if not title or not slug:
            continue

        # Parse and verify deadline
        deadline_raw = comp.get("deadline")
        if not deadline_raw:
            continue
        
        try:
            deadline = datetime.fromisoformat(deadline_raw.replace("Z", "+00:00"))
        except Exception:
            continue

        # STRICT STATUS FILTER: Only active, upcoming competitions (no past/ended challenges)
        if deadline <= now:
            continue

        # Format prize pool
        reward_obj = comp.get("reward")
        if isinstance(reward_obj, dict) and reward_obj.get("quantity"):
            qty = reward_obj.get("quantity")
            curr = reward_obj.get("id", "USD")
            prize_pool = f"${qty:,.0f} {curr}"
        elif comp.get("rewardTypeName"):
            prize_pool = comp.get("rewardTypeName")
        else:
            prize_pool = "Knowledge & Medals"

        # Direct working deep link to the competition
        link = f"https://www.kaggle.com/competitions/{slug}"

        # Teams count & description
        total_teams = comp.get("totalTeams", 0)
        brief_desc = comp.get("briefDescription", "").strip()
        desc = brief_desc if brief_desc else f"Compete on Kaggle in {title}. Build machine learning models and climb the leaderboard."
        if total_teams:
            desc += f" (Active teams: {total_teams:,})"

        # All Kaggle competitions are digital / online worldwide
        mode = "Online"
        location = "Online"

        if not is_bangalore_or_online(location=location, mode=mode, text=f"{title} {desc}"):
            continue

        categories = comp.get("categories", [])
        tag_names = []
        if isinstance(categories, list):
            tag_names = [c.get("name") if isinstance(c, dict) else str(c) for c in categories]
        elif isinstance(categories, dict):
            tag_names = [c.get("name") if isinstance(c, dict) else str(c) for c in categories.get("categories", [])]
        tags = ["Kaggle", "Machine Learning", "Data Science"] + tag_names[:2]

        events.append({
            "title": title[:150],
            "description": desc[:500],
            "type": "hackathon",
            "organizer": comp.get("hostName") or comp.get("organization") or "Kaggle & Partners",
            "deadline": deadline,
            "location": location,
            "external_link": link,
            "prize_pool": prize_pool,
            "mode": mode,
            "team_size": f"1-{comp.get('maxTeamSize', 5)} Members",
            "tags": tags
        })

    return events
