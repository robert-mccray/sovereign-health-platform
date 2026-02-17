# infra/providers.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    vault = {
      source  = "hashicorp/vault"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  s3_use_path_style           = true #local stack path
  
  endpoints {
    s3  = "http://localhost:4566"
    sts = "http://localhost:4566"
  }
}

provider "vault" {
  address = "http://localhost:8200"
  token   = "root"
}