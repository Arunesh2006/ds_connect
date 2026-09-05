import asyncio
from uuid import UUID
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.models.opportunity import Opportunity
from app.tasks.scrapers.devpost_scraper import scrape_devpost_hackathons
from app.tasks.scrapers.kaggle_scraper import scrape_kaggle_competitions

ADMIN_USER_ID = UUID("00000000-0000-0000-0000-000000000001")

async def run_all_scrapers() -> Dict[str, Any]:
    """
    Executes all scrapers, deduplicates against the database,
    and inserts only new opportunities.
    """
    print("[SCRAPER] Starting automated event fetch...")
    
    # Gather events from all sources concurrently
    scraped_events: List[Dict[str, Any]] = []
    
    devpost_events = await scrape_devpost_hackathons()
    kaggle_events = await scrape_kaggle_competitions()
    
    scraped_events.extend(devpost_events)
    scraped_events.extend(kaggle_events)
    
    print(f"[SCRAPER] Fetched {len(scraped_events)} raw events from external sources.")
    
    inserted_count = 0
    skipped_count = 0
    
    async with AsyncSessionLocal() as db:
        for item in scraped_events:
            link = item.get("external_link")
            title = item.get("title")
            
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
                tags=item.get("tags", ["Data Science"]),
                submitted_by=ADMIN_USER_ID
            )
            db.add(new_opp)
            inserted_count += 1
            
        await db.commit()
        
    summary = {
        "status": "success",
        "total_fetched": len(scraped_events),
        "new_opportunities_added": inserted_count,
        "duplicates_skipped": skipped_count,
        "timestamp": datetime.utcnow().isoformat()
    }
    print(f"[SCRAPER] Complete: {inserted_count} new opportunities added, {skipped_count} duplicates skipped.")
    return summary

if __name__ == "__main__":
    asyncio.run(run_all_scrapers())
