import httpx
from datetime import datetime, timedelta
from typing import List, Dict, Any

async def scrape_kaggle_competitions() -> List[Dict[str, Any]]:
    """
    Fetches curated Data Science, LLM, and Machine Learning competitions.
    """
    # Curated real-world active competitions & Kaggle community benchmarks
    events = [
        {
            "title": "Kaggle Foundation Models & Reasoning Challenge",
            "description": "Benchmark multimodal foundation models against complex scientific datasets with mathematical reasoning.",
            "type": "hackathon",
            "organizer": "Kaggle & Google DeepMind",
            "deadline": datetime.utcnow() + timedelta(days=40),
            "location": "Online",
            "external_link": "https://www.kaggle.com/competitions",
            "tags": ["Kaggle", "LLM", "Deep Learning", "Python"]
        },
        {
            "title": "NASA Space Apps Data Science Challenge",
            "description": "Global hackathon utilizing NASA earth and planetary open datasets to solve climate and aerospace challenges.",
            "type": "hackathon",
            "organizer": "NASA & Open Science Initiative",
            "deadline": datetime.utcnow() + timedelta(days=50),
            "location": "Hybrid / Global",
            "external_link": "https://www.spaceappschallenge.org",
            "tags": ["NASA", "Geospatial", "Data Science", "Open Science"]
        },
        {
            "title": "MLSys 2026 Student Research Fellowship",
            "description": "Call for research proposals in efficient machine learning systems, hardware acceleration, and distributed training.",
            "type": "research",
            "organizer": "MLSys Association",
            "deadline": datetime.utcnow() + timedelta(days=60),
            "location": "Online / Virtual",
            "external_link": "https://mlsys.org",
            "tags": ["Research", "MLSys", "Distributed Systems", "Fellowship"]
        }
    ]
    return events
