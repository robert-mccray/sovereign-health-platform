import boto3
import hvac
import os
import base64
from botocore.exceptions import ClientError
from fastapi import UploadFile
from app.models.evidence import EvidenceMetadata

class EvidenceIngestionService:
    def __init__(self):
        # AWS Client (S3)
        self.s3 = boto3.client(
            's3',
            endpoint_url=os.getenv('AWS_ENDPOINT_URL', 'http://localhost:4566'),
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=os.getenv('AWS_REGION')
        )
        self.bucket = os.getenv('S3_BUCKET_NAME')

        # Vault Client (Encryption/Signing)
        self.vault = hvac.Client(
            url=os.getenv('VAULT_ADDR', 'http://localhost:8200'),
            token=os.getenv('VAULT_TOKEN')
        )
        self.transit_key = os.getenv('VAULT_TRANSIT_KEY')

    async def process_evidence(self, file: UploadFile, meta: EvidenceMetadata) -> dict:
        # 1. Prepare Data for Signing
        # Vault API requires 'input' to be a Base64 encoded string.
        plaintext_input = f"patient:{meta.patient_id}|ts:{meta.event_timestamp}"
        encoded_input = base64.b64encode(plaintext_input.encode()).decode()

        # 2. Sign the content (Simulating Azure Key Vault Signing)
        # NUCLEAR FIX: We use the low-level 'write' method to bypass library quirks.
        # This hits the 'POST /transit/sign/:name' endpoint directly.
        signature_response = self.vault.write(
            path=f'transit/sign/{self.transit_key}',
            input=encoded_input
        )
        
        # The raw API response structure is slightly different
        signature = signature_response['data']['signature']

        # 3. Determine Layer (Bronze vs. Silver)
        layer = "bronze/raw"
        if meta.ai_confidence_score and meta.ai_confidence_score > 0.85:
            layer = "silver/validated"
        
        file_key = f"{layer}/{meta.patient_id}/{file.filename}"

        # 4. Upload to Sovereign Lake (AWS S3)
        try:
            self.s3.upload_fileobj(
                file.file,
                self.bucket,
                file_key,
                ExtraArgs={"Metadata": {
                    "x-evidence-signature": signature,
                    "x-source-system": meta.source_system
                }}
            )
        except ClientError as e:
            print(f"CRITICAL: Failed to write evidence to S3: {e}")
            raise e

        return {
            "evidence_id": file_key,
            "storage_path": f"s3://{self.bucket}/{file_key}",
            "encryption_signature": signature,
            "status": "SECURED"
        }