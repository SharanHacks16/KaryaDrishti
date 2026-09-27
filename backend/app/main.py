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
    allow_origins=["*"],
    allow_credentials=False,
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

@app.on_event("startup")
def startup_db_seed():
    from app.database.session import SessionLocal
    from app.models.domain import Project
    db = SessionLocal()
    try:
        if db.query(Project).count() == 0:
            import os, sys
            repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
            candidates = [
                repo_root,
                os.path.abspath(os.path.join(os.getcwd(), '..')),
                os.getcwd()
            ]
            for c in candidates:
                if c not in sys.path and os.path.exists(c):
                    sys.path.insert(0, c)

            try:
                from scripts.seed_database import seed_real_data
                from scripts.run_predictions import run_ml_inference_and_update_db
            except Exception as imp_err:
                import importlib.util
                seed_script = os.path.join(repo_root, 'scripts', 'seed_database.py')
                pred_script = os.path.join(repo_root, 'scripts', 'run_predictions.py')
                
                spec1 = importlib.util.spec_from_file_location("seed_database", seed_script)
                seed_mod = importlib.util.module_from_spec(spec1)
                spec1.loader.exec_module(seed_mod)
                seed_real_data = seed_mod.seed_real_data

                spec2 = importlib.util.spec_from_file_location("run_predictions", pred_script)
                pred_mod = importlib.util.module_from_spec(spec2)
                spec2.loader.exec_module(pred_mod)
                run_ml_inference_and_update_db = pred_mod.run_ml_inference_and_update_db

            print("Auto-seeding database on cloud startup...")
            seed_real_data()
            run_ml_inference_and_update_db()
    except Exception as e:
        print("Startup seed notice:", e)
    finally:
        db.close()

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
