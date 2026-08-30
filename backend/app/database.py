import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost:3306/kisanq")
SQLITE_FALLBACK_URL = "sqlite:///./kisanq.db"

def get_engine():
    if DATABASE_URL and DATABASE_URL.startswith("mysql"):
        # 1. Direct connection attempt (for Aiven MySQL / Cloud DBs)
        try:
            connect_args = {}
            if "aiven" in DATABASE_URL.lower() or "ssl" in DATABASE_URL.lower():
                connect_args = {"ssl": {"ssl_mode": "PREFERRED"}}

            engine = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,
                pool_recycle=3600,
                connect_args=connect_args
            )
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"[DB] Connected to MySQL database via DATABASE_URL successfully.")
            return engine
        except Exception as e1:
            print(f"[DB Notice] Direct MySQL connection check: {e1}")

        # 2. Localhost fallback with DB creation
        try:
            from urllib.parse import urlparse
            url = urlparse(DATABASE_URL)
            db_name = url.path.lstrip('/') or "kisanq"
            user = url.username or "root"
            password = url.password or ""
            host = url.hostname or "localhost"
            port = url.port or 3306

            server_url = f"mysql+pymysql://{user}:{password}@{host}:{port}/"
            server_engine = create_engine(server_url, isolation_level="AUTOCOMMIT")
            with server_engine.connect() as conn:
                conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))

            engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"[DB] Connected to local MySQL database '{db_name}'.")
            return engine
        except Exception as e2:
            print(f"[DB Warning] MySQL connection failed. Falling back to SQLite: {SQLITE_FALLBACK_URL}")

    # Fallback to SQLite
    engine = create_engine(
        SQLITE_FALLBACK_URL,
        connect_args={"check_same_thread": False}
    )
    print(f"[DB] Connected to SQLite database successfully.")
    return engine

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
