# infra/main.tf

# Module 1: The AWS S3 Evidence Lake
module "evidence_lake" {
  source      = "./modules/aws-evidence-lake"
  bucket_name = "shep-evidence-lake-v1"
}

# Module 2: The Azure/Vault Encryption Service
module "clinical_keys" {
  source = "./modules/azure-clinical-core"
}