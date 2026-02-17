graph TD
    subgraph "Azure (Clinical Core)"
        UI[Next.js Dashboard]
        API[Python Evidence API]
        KV[Azure Key Vault / Vault]
    end

    subgraph "AWS (Sovereign Evidence)"
        S3[Evidence Lake (S3)]
        Bronze[Bronze: Raw]
        Silver[Silver: Validated]
        Gold[Gold: Curated]
    end

    User --> UI
    UI --> API
    API -- "Sign/Encrypt" --> KV
    API -- "Store Evidence" --> S3
    
    subgraph "Governance Plane"
        TF[Terraform Cloud]
        TF -- "Deploys" --> API
        TF -- "Configures" --> S3
        TF -- "Manages" --> KV
    end