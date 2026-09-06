from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.whatsapp import WhatsAppPublishRequest, WhatsAppPublishResponse
from app.services.whatsapp_service import WhatsAppService

router = APIRouter()

@router.post("/publish", response_model=WhatsAppPublishResponse, summary="Publish announcement to WhatsApp")
async def publish_to_whatsapp(
    req: WhatsAppPublishRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Formats standardized announcement and posts to official WhatsApp Cloud API.
    If Meta Cloud API credentials are not configured or direct Community posting is restricted,
    generates pre-formatted WhatsApp share link and copied message payload.
    """
    result = await WhatsAppService.publish_message(
        db=db,
        content_type=req.content_type,
        entity_id=req.id,
        custom_message=req.custom_message
    )
    return result
