# Sovereign Health Evidence Platform (SHEP)

> A Multi-Cloud, Governed SaaS for Clinical Evidence Management.

## 🚀 The Mission
Healthcare data is often locked in proprietary silos, creating liability risks for AI-driven decisions. **SHEP** provides a sovereign infrastructure that ingests, validates, and stores clinical evidence with a forensic audit trail, spanning **Azure (Clinical Core)** and **AWS (Disaster Recovery)**.

## 🏗 Architecture & Tradeoffs (Pillar 1)
We utilize a **Hybrid-Cloud Architecture** to maximize resilience and compliance.
* **Primary Compute (Azure):** chosen for deep integration with Active Directory (Entra ID) and FHIR standards.
* **Evidence Lake (AWS):** chosen for S3's immutable storage capabilities for raw audit logs.
* **Tradeoff:** Increased IaC complexity is accepted to gain "Exit Strategy" capability—we are not vendor-locked.

![Architecture Diagram](./docs/architecture/medallion-data-flow.png)

## 🛠 Tech Stack
* **Infrastructure:** Terraform (Multi-Provider), Docker, Kubernetes (k3d/AKS).
* **Backend:** Python (FastAPI) with Medallion Data Pattern.
* **Security:** OIDC (Identity Federation), Zero-Trust Networking.
* **Observability:** OpenTelemetry, Prometheus.

## ⚡ Deployment (Pillar 3)
This project uses a **GitOps-driven** workflow.
1.  **Infrastructure:** Defined in `/infra`, deployed via Terraform.
2.  **Application:** Dockerized in `/src`, built via GitHub Actions.

## 🔒 Security Baseline (Pillar 4)
* **Identity First:** No long-lived keys. All cloud access is managed via OIDC Workload Identity.
* **Data Sovereignty:** Bronze (Raw) data is encrypted with customer-managed keys (CMK) before landing in S3.

## 🏃 Quick Start (Local Simulation)
1.  **Spin up the Platform:**
    ```bash
    docker-compose up -d --build
    ```
2.  **Deploy Infrastructure:**
    ```bash
    cd infra && terraform apply
    ```