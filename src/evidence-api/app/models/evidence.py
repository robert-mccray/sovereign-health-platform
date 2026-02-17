from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict

class EvidenceMetadata(BaseModel):
    #note the ": str" type hints - required
    patient_id: str = Field(..., description="The unique patient id (hashed)")
    source_system: str = Field(..., description="origin (e.g., 'EPIC_EHR', 'PACS')")
    event_timestamp: datetime = Field(default_factory=datetime.utcnow)
    evidence_type: str = Field(..., pattern="^(clinical_note|lab_result|dicom_scan)$")

    #the "contract" - minimum confidence score for Silver layer
    ai_confidence_score: Optional[float] = Field(None, ge=0.0, le=1.0)

class EvidenceResponse(BaseModel):
    evidence_id: str
    storage_path: str
    encryption_signature: str
    status: str