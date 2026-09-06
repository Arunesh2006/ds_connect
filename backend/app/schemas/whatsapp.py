from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class WhatsAppPublishRequest(BaseModel):
    content_type: str = Field(..., example="hackathon", description="Type: hackathon, placement, project, or custom")
    id: Optional[str] = Field(None, description="UUID of entity to format message for")
    custom_message: Optional[str] = Field(None, description="Optional custom override text")

class WhatsAppPublishResponse(BaseModel):
    success: bool
    status: str
    message: str
    formatted_text: str
    share_url: str
    destination: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
