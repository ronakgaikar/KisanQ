import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.models import User
from app.routes import auth, farmers, centres, crops, slots, bookings, queue, procurement, payments, notifications, dashboard

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Auto-seed database if empty (e.g. fresh Aiven MySQL database on Render)
try:
    db = SessionLocal()
    if db.query(User).first() is None:
        print("[STARTUP] Database is empty. Auto-seeding KisanQ demo dataset...")
        from seed import seed_database
        seed_database()
    db.close()
except Exception as e:
    print(f"[STARTUP DB NOTICE] {e}")

app = FastAPI(
    title="KisanQ API - Smart Farmer Procurement Management Platform",
    description="Backend REST API for KisanQ (SIH PS 26032) - Department of Consumer Affairs",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(auth.router)
app.include_router(farmers.router)
app.include_router(centres.router)
app.include_router(crops.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(queue.router)
app.include_router(procurement.router)
app.include_router(payments.router)
app.include_router(notifications.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "KisanQ Smart Farmer Procurement API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
