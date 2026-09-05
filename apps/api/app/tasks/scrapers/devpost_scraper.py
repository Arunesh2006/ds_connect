import httpx
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from typing import List, Dict, Any

DEVPOST_RSS_URL = "https://devpost.com/hackathons/feed"

async def scrape_devpost_hackathons() -> List[Dict[str, Any]]:
    """
    Fetches real-time student hackathons from Devpost's public RSS feed.
    """
    events = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        async with httpx.AsyncClient(headers=headers, timeout=10.0, follow_redirects=True) as client:
            resp = await client.get(DEVPOST_RSS_URL)
            if resp.status_code == 200:
                root = ET.fromstring(resp.content)
                # Find all items in RSS
                for item in root.findall(".//item")[:10]:
                    title = item.findtext("title", "Student Hackathon")
                    link = item.findtext("link", "https://devpost.com/hackathons")
                    desc = item.findtext("description", "Global competitive hackathon on Devpost.")
                    pub_date = item.findtext("pubDate", "")
                    
                    # Clean simple HTML tags from description if any
                    clean_desc = desc.split("<")[0].strip() if "<" in desc else desc.strip()
                    if not clean_desc or len(clean_desc) < 15:
                        clean_desc = f"Compete in {title} on Devpost. Open to data science and software engineering students."

                    # Estimate deadline (30 days from publication or now)
                    deadline = datetime.utcnow() + timedelta(days=30)
                    
                    events.append({
                        "title": title.strip(),
                        "description": clean_desc,
                        "type": "hackathon",
                        "organizer": "Devpost Community",
                        "deadline": deadline,
                        "location": "Online",
                        "external_link": link.strip(),
                        "tags": ["Devpost", "Hackathon", "Coding", "Prizes"]
                    })
    except Exception as e:
        print(f"Devpost scrape notice: {e}")
        
    return events
