from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
from app.api.v1 import auth, users, portfolio, projects, risk, alerts

# Create DB tables if not present
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="KARYADRISHTI Web-Based Integrated Project-Monitoring Platform API"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(portfolio.router, prefix=f"{settings.API_V1_STR}/portfolio", tags=["Portfolio"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["Projects"])
app.include_router(risk.router, prefix=f"{settings.API_V1_STR}/risk", tags=["Risk Center"])
app.include_router(alerts.router, prefix=f"{settings.API_V1_STR}/alerts", tags=["Early Warning Alerts"])

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "tagline": "See What's Ahead. Act Before It's Late.",
        "documentation": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
