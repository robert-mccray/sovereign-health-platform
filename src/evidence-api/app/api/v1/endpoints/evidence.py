# FIX: Change 'UplaodFile' to 'UploadFile'
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from app.services.ingestion import EvidenceIngestionService
from app.models.evidence import EvidenceMetadata, EvidenceResponse
import json

router = APIRouter()

@router.post("/ingest", response_model=EvidenceResponse)
async def ingest_evidence(
    file: UploadFile = File(...),
    metadata_json: str = Form(...), # Expecting JSON string for metadata
):
    """
    Securely ingests clinical evidence.
    - Validates metadata.
    - Signs transaction via Vault (Azure Sim).
    - Stores immutable record in S3 (AWS Sim).
    """
    try:
        # Parse and Validate Metadata
        meta_dict = json.loads(metadata_json)
        meta = EvidenceMetadata(**meta_dict)
        
        # Initialize Service (Dependency Injection would be better for Prod)
        service = EvidenceIngestionService()
        
        result = await service.process_evidence(file, meta)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))