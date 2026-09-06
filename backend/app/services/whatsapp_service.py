import urllib.parse
from typing import Dict, Any, Optional
from uuid import UUID
import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.models.opportunity import Opportunity
from app.models.placement import Placement
from app.models.project import Project

class WhatsAppService:
    @staticmethod
    def generate_hackathon_message(h: Opportunity) -> str:
        deadline_str = h.deadline.strftime("%d %b %Y") if h.deadline else "Check link"
        prize = h.prize_pool or "Recognition & Awards"
        mode = h.mode or "Online"
        
        return (
            f"🚀 *HACKATHON ALERT*\n\n"
            f"*{h.title}*\n\n"
            f"🏢 *Organizer:* {h.organizer}\n"
            f"🏆 *Prize Pool:* {prize}\n"
            f"📅 *Registration Deadline:* {deadline_str}\n"
            f"💻 *Mode:* {mode}\n"
            f"👥 *Team Size:* {h.team_size or '1-4'}\n\n"
            f"{h.description}\n\n"
            + (f"🔗 *Register:*\n{h.external_link}\n\n" if h.external_link else "") +
            f"Shared via DS-Connect"
        )

    @staticmethod
    def generate_placement_message(p: Placement) -> str:
        pkg = f"{p.package_lpa} LPA" if p.package_lpa else "Competitive / Best in Industry"
        loc = p.location or "Hybrid"
        deadline_str = p.application_deadline.strftime("%d %b %Y") if p.application_deadline else "Open"
        
        return (
            f"💼 *PLACEMENT OPPORTUNITY*\n\n"
            f"🏢 *Company:* {p.company}\n"
            f"💻 *Role:* {p.role}\n"
            f"📍 *Location:* {loc}\n"
            f"💰 *Package:* {pkg}\n\n"
            f"📅 *Deadline:* {deadline_str}\n\n"
            + (f"🔗 *Apply:*\n{p.application_link}\n\n" if p.application_link else "") +
            f"Shared via DS-Connect"
        )

    @staticmethod
    def generate_project_message(proj: Project) -> str:
        tech_str = " • ".join(proj.technologies) if proj.technologies else "Python • Data Science"
        
        return (
            f"🚀 *PROJECT SHOWCASE*\n\n"
            f"*{proj.title}*\n\n"
            f"{proj.description or 'Innovative Data Science student project.'}\n\n"
            f"🛠 *Technologies:*\n{tech_str}\n\n"
            + (f"🔗 *GitHub:* {proj.repo_url}\n" if proj.repo_url else "")
            + (f"🌐 *Live Demo:* {proj.live_url}\n\n" if proj.live_url else "\n") +
            f"Shared via DS-Connect"
        )

    @classmethod
    async def publish_message(cls, db: AsyncSession, content_type: str, entity_id: Optional[str] = None, custom_message: Optional[str] = None) -> Dict[str, Any]:
        text = custom_message or ""
        
        if not text and entity_id:
            uid = UUID(entity_id)
            if content_type == "hackathon":
                res = await db.execute(select(Opportunity).where(Opportunity.id == uid))
                h = res.scalar_one_or_none()
                if h:
                    text = cls.generate_hackathon_message(h)
            elif content_type == "placement":
                res = await db.execute(select(Placement).where(Placement.id == uid))
                p = res.scalar_one_or_none()
                if p:
                    text = cls.generate_placement_message(p)
            elif content_type == "project":
                res = await db.execute(select(Project).where(Project.id == uid))
                proj = res.scalar_one_or_none()
                if proj:
                    text = cls.generate_project_message(proj)

        if not text:
            text = "📢 *ANNOUNCEMENT FROM DS-CONNECT*\n\nShared via DS-Connect Community"

        encoded_text = urllib.parse.quote(text)
        fallback_url = f"https://api.whatsapp.com/send?text={encoded_text}"
        
        # Check if official Meta WhatsApp Business Cloud API is configured
        has_official_creds = bool(
            settings.WHATSAPP_ACCESS_TOKEN and 
            settings.WHATSAPP_PHONE_NUMBER_ID and 
            settings.WHATSAPP_DESTINATION_ID
        )

        if has_official_creds:
            api_url = f"https://graph.facebook.com/v19.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
            headers = {
                "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
                "Content-Type": "application/json"
            }
            payload = {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": settings.WHATSAPP_DESTINATION_ID,
                "type": "text",
                "text": {"body": text}
            }
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(api_url, headers=headers, json=payload)
                    if resp.status_code in (200, 201):
                        return {
                            "success": True,
                            "status": "published_via_cloud_api",
                            "message": "Message successfully published via Meta WhatsApp Cloud API.",
                            "formatted_text": text,
                            "share_url": fallback_url,
                            "destination": settings.WHATSAPP_DESTINATION_ID,
                            "details": resp.json()
                        }
                    else:
                        # Official API returned an error (e.g. invalid token / template required for unapproved channel)
                        return {
                            "success": True,
                            "status": "fallback_share_ready",
                            "message": f"WhatsApp Cloud API responded with {resp.status_code}. Fallback direct share link generated.",
                            "formatted_text": text,
                            "share_url": fallback_url,
                            "destination": settings.WHATSAPP_DESTINATION_ID,
                            "details": resp.json()
                        }
            except Exception as e:
                return {
                    "success": True,
                    "status": "fallback_share_ready",
                    "message": f"Could not reach WhatsApp Cloud API ({str(e)}). Direct share URL generated.",
                    "formatted_text": text,
                    "share_url": fallback_url,
                    "destination": settings.WHATSAPP_DESTINATION_ID
                }

        # Clean fallback when API credentials are placeholders
        return {
            "success": True,
            "status": "fallback_share_ready",
            "message": "WhatsApp announcement generated and ready for 1-click community posting.",
            "formatted_text": text,
            "share_url": fallback_url,
            "destination": settings.WHATSAPP_DESTINATION_ID or "Community Group"
        }
