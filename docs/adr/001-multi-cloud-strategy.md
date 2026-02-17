# ADR 001: Sovereign Hybrid-Cloud Architecture for Evidence Management

**Status:** Accepted
**Date:** 2026-02-16
**Author:** [Your Name]
**Context:** The Sovereign Health Evidence Platform (SHEP)

## 1. The Context & Problem
We are building a multi-tenant SaaS platform for healthcare providers that must ingest, validate, and store sensitive clinical data (PHI).
* **The Constraint:** Recent ransomware attacks on major hospital systems (Change Healthcare, etc.) have highlighted the critical risk of "Single Cloud Dependency."
* **The Requirement:** The system must be **Resilient** (survive a total cloud provider outage), **Compliant** (HIPAA/GDPR), and **Auditable** (Forensic Evidence Layer).
* **The Regulatory Constraint:** Patient data residency must be strictly controlled; "Bronze" (Raw) evidence must remain immutable.

## 2. The Decision
We have decided to implement a **Sovereign Hybrid-Cloud Architecture**, utilizing:
1.  **Azure (Primary Clinical Core):** For Identity (Entra ID), FHIR API standards, and clinical dashboards.
2.  **AWS (Evidence & Recovery):** For the immutable "Evidence Lake" (S3) and isolated AI/ML processing.
3.  **Terraform (Unified Governance):** To orchestrate the lifecycle of both clouds from a single control plane.

## 3. Technology Selection & Tradeoffs (Pillar 1)

### A. Infrastructure-as-Code (IaC)
* **Choice:** **Terraform** (with `localstack` and `vault` providers for simulation).
* **Why:** Terraform allows us to write "Cloud-Agnostic" policy logic. We can swap the backend provider (AWS vs. Azure) without rewriting the core governance rules.
* **Tradeoff:**
    * *Pro:* Prevents vendor lock-in; enables "Compliance-as-Code" via reusable modules.
    * *Con:* Higher initial complexity than using native tools like AWS CDK or Azure Bicep. State management becomes critical.
* **Mitigation:** We use strict **State Locking** and separate state files for `dev` and `prod` environments.

### B. Secrets & Encryption (Security Pillar)
* **Choice:** **HashiCorp Vault** (simulating Azure Key Vault).
* **Why:** We require **Transit Encryption** (signing data on the fly) rather than just "Encryption at Rest." Vault provides a centralized "Encryption-as-a-Service" API that works across both AWS and Azure workloads.
* **Tradeoff:**
    * *Pro:* Centralized audit log of *who* decrypted *what* and *when*.
    * *Con:* Adds a critical dependency; if Vault goes down, the entire platform stops.
* **Mitigation:** In Production, we would use **Azure Key Vault Premium** with Geo-Redundancy, but keep the *logic* abstract enough to failover to AWS KMS if needed.

### C. Data Storage (Architecture Pillar)
* **Choice:** **AWS S3** (Simulated via LocalStack).
* **Why:** S3 Object Lock and Versioning provide the strongest "Immutability" guarantees for the **Evidence Layer**.
* **Production constraint:** In a real deployment, we would use **S3 Glacier Deep Archive** for cost-effective long-term retention of "Bronze" data.

## 4. Constraints Imposed
* **Latency:** Cross-cloud communication (Azure App -> AWS S3) introduces latency.
    * *Decision:* The "Evidence Upload" path is asynchronous. The user gets an immediate "Received" acknowledgment, but the heavy processing happens in the background.
* **Cost:** Running two clouds can double ingress/egress fees.
    * *Decision:* We only egress *metadata* (small JSON), not full binary blobs, keeping costs low.

## 5. Consequences
* **Positive:** We have achieved a **Zero-Trust Boundary**. Even if an attacker compromises our Azure Active Directory, they cannot delete the backups in AWS because the delete permissions are physically separated.
* **Negative:** Developers must learn two cloud providers (AWS & Azure).