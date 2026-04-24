# 🏥 Sovereign Health Evidence Platform (SHEP)

A Multi-Cloud, Governed SaaS Data Platform for Clinical Evidence Management. 

In highly regulated environments (HIPAA / SOC2), data is often locked in proprietary silos, creating massive liability risks for AI-driven decisions. SHEP provides a sovereign infrastructure that securely ingests, validates, and stores clinical evidence with a mathematically verifiable forensic audit trail.

![Sovereign Health Architecture Diagram](./architecture-diagram.png)

### 📈 Business Impact & Enterprise Risk Mitigation
* **Audit-Ready by Default:** Immutable storage and strict data lineage tracking satisfy rigorous HIPAA and SOC2 compliance audits out of the box, drastically reducing enterprise liability.
* **Vendor Exit Strategy (Multi-Cloud):** Explicitly designed to avoid single-vendor lock-in. Azure drives the primary clinical compute, while AWS handles immutable disaster recovery. 
* **Identity-First Security:** Eradicates the risk of leaked credentials. Absolutely no long-lived keys are used; all cross-cloud access is managed dynamically via OIDC Workload Identity Federation.

### 🏗️ Architectural Pillars & Tradeoffs

**1. Hybrid-Cloud Compute & Storage**
* **Primary (Azure):** Chosen for deep, native integration with Active Directory (Entra ID) and enterprise FHIR standards.
* **Evidence Lake (AWS):** Chosen for S3's Object Lock and immutable storage capabilities for raw audit logs.
* *Architectural Tradeoff:* We intentionally accept the increased operational complexity of Multi-Provider Terraform in exchange for an absolute "Exit Strategy" and superior disaster recovery.

**2. The Security Baseline**
* **Data Sovereignty:** Bronze (Raw) data is encrypted with Customer-Managed Keys (CMK) *before* it ever lands in the storage bucket.
* **Zero-Trust Networking:** All microservice communication is validated via identity meshes, not just perimeter firewalls.

**3. Observability & Data Flow**
* **Backend:** Python (FastAPI) utilizing the Medallion Data Pattern for reliable data refinement.
* **Telemetry:** Instrumenting OpenTelemetry and Prometheus to ensure absolute visibility into API degradation before clinical users feel it.

### 🚀 Quick Start (Local Simulation)

This project uses a GitOps-driven workflow.

**1. Spin up the Application Environment:**
```bash
docker-compose up -d --build
```

**2. Deploy the Infrastructure (Local State):**

```bash
cd infra && terraform apply
```
