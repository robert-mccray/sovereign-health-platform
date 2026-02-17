variable "bucket_name" {}

resource "aws_s3_bucket" "evidence_landing" {
  bucket = var.bucket_name
}

# Encryption (Security Pillar)
resource "aws_s3_bucket_server_side_encryption_configuration" "encryption" {
  bucket = aws_s3_bucket.evidence_landing.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Medallion Layers (Architecture Pillar)
resource "aws_s3_object" "layers" {
  for_each = toset(["bronze/raw/", "silver/validated/", "gold/curated/", "silver/rejects/"])
  bucket   = aws_s3_bucket.evidence_landing.id
  key      = each.value
}

output "bucket_id" {
  value = aws_s3_bucket.evidence_landing.id
}