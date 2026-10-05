import asyncio
from uuid import UUID
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.opportunity import Opportunity
from app.models.profile import Profile
from app.tasks.scrapers.devpost_scraper import scrape_devpost_hackathons
from app.tasks.scrapers.kaggle_scraper import scrape_kaggle_competitions
from app.tasks.scrapers.mlh_scraper import scrape_mlh_hackathons
from app.tasks.scrapers.web_discovery import discover_new_opportunities

async def run_all_scrapers(extra_urls: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Executes all scrapers and autonomous discovery engines concurrently,
    deduplicates against the database, and safely inserts new opportunities.
    """
    print("[SCRAPER & DISCOVERY] Starting automated event fetch...")
    
    # Gather events from all sources concurrently
    scraped_events: List[Dict[str, Any]] = []
    
    results = await asyncio.gather(
        scrape_devpost_hackathons(),
        scrape_kaggle_competitions(),
        scrape_mlh_hackathons(),
        discover_new_opportunities(extra_urls),
        return_exceptions=True
    )
    
    for r in results:
        if isinstance(r, list):
            scraped_events.extend(r)
        elif isinstance(r, Exception):
            print(f"[SCRAPER] Error in crawl task: {r}")
    
    print(f"[SCRAPER] Fetched {len(scraped_events)} raw events from external sources.")
    
    inserted_count = 0
    skipped_count = 0
    db_error = None
    
    try:
        async with AsyncSessionLocal() as db:
            # Resolve a valid admin user ID or None
            admin_res = await db.execute(select(Profile.id).where(Profile.role == "admin").limit(1))
            valid_admin_id = admin_res.scalar_one_or_none()
            
            for item in scraped_events:
                link = item.get("external_link")
                title = item.get("title", "")
                location = item.get("location", "Online")
                mode = item.get("mode", "Online")
                desc = item.get("description", "")

                # Master Location Filter: Must be Bangalore (within ~50km) or totally Online / Digital
                from app.tasks.scrapers.location_filter import is_bangalore_or_online
                if not is_bangalore_or_online(location=location, mode=mode, text=f"{title} {desc}"):
                    skipped_count += 1
                    continue
                
                # Deduplication Check 1: Check by exact external URL
                existing = None
                if link:
                    res = await db.execute(
                        select(Opportunity).where(Opportunity.external_link == link)
                    )
                    existing = res.scalar_one_or_none()
                    
                # Deduplication Check 2: Check by exact title
                if not existing and title:
                    res = await db.execute(
                        select(Opportunity).where(Opportunity.title == title)
                    )
                    existing = res.scalar_one_or_none()
                    
                if existing:
                    skipped_count += 1
                    continue  # Already in database, skip!
                    
                # Create new Opportunity record
                new_opp = Opportunity(
                    title=item["title"][:150],
                    description=item["description"],
                    type=item.get("type", "hackathon"),
                    status="published",
                    organizer=item.get("organizer", "External Source"),
                    deadline=item["deadline"],
                    location=item.get("location", "Online"),
                    external_link=link,
                    prize_pool=item.get("prize_pool", "$25,000 USD"),
                    mode=item.get("mode", "Online"),
                    team_size=item.get("team_size", "1-4 Members"),
                    tags=item.get("tags", ["Data Science"]),
                    submitted_by=valid_admin_id
                )
                db.add(new_opp)
                inserted_count += 1
                
            await db.commit()
    except Exception as e:
        db_error = str(e)
        print(f"[SCRAPER] Database connection notice (ensure DATABASE_URL is set in Render): {e}")
        
    summary = {
        "status": "success" if not db_error else "db_error",
        "total_fetched": len(scraped_events),
        "new_opportunities_added": inserted_count,
        "duplicates_skipped": skipped_count,
        "error": db_error,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    print(f"[SCRAPER] Complete: {inserted_count} new opportunities added, {skipped_count} duplicates skipped.")
    return summary

if __name__ == "__main__":
    asyncio.run(run_all_scrapers())
