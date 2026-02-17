# Enable Transit Engine (Simulates Key Vault)
resource "vault_mount" "transit" {
  path        = "transit"
  type        = "transit"
  description = "Sovereign Health Encryption Service"
}

# Create a Key for Signing Evidence
resource "vault_transit_secret_backend_key" "evidence_signer" {
  backend = vault_mount.transit.path
  name    = "evidence-verification-key"
  type    = "rsa-2048"
  deletion_allowed = false
}

output "key_name" {
  value = vault_transit_secret_backend_key.evidence_signer.name
}