from fastapi import FastAPI
from app.api.v1.endpoints import evidence
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SHEP Evidence API", version="1.0.0")

# include routers
app.include_router(evidence.router, prefix="/api/v1/evidence", tags=["evidence"])

# New: Allow the Frontend (port:3000) to talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "evidence-api"}