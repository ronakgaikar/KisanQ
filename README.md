# KisanQ – Smart Farmer Procurement Management Platform

> **"Book. Track. Procure. Without the Wait."**

**Problem Statement ID:** 26032  
**Problem Statement Title:** Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status.  
**Organization:** Ministry of Consumer Affairs, Food & Public Distribution  
**Department:** Department of Consumer Affairs (DoCA)  
**Theme:** Smart Automation  

---

## 🌾 Overview & Purpose

KisanQ is a web-based smart procurement management platform designed to eliminate long waiting times, reduce physical mandi congestion, and establish transparent real-time tracking for farmers during crop procurement.

### Key Goals & Features
1. **Farmer Registration & Slot Booking**: Multi-step intuitive slot wizard for crop selection, quantity entry, mandi centre selection, date, and timed slot booking.
2. **Dynamic Queue Token Generation**: Automatic generation of unique tokens (e.g. `A101`, `A102`, `A103`) per Procurement Centre + Date.
3. **Smart Queue Management**: Transparent waiting time algorithm: `Estimated Waiting Time = Farmers Ahead × Centre Average Processing Time`.
4. **Live Counter Operations**: Operator console featuring arrival verification, prominent **"CALL NEXT FARMER"** trigger, counter processing, skip, and completion controls.
5. **Verified Procurement & Payment Tracking**: Digital recording of actual measured quantity, rate, total amount calculation, quality grading, and direct payment status tracking (`PENDING`, `PROCESSING`, `COMPLETED`).
6. **In-App Notification Architecture**: Built with a modular `NotificationService` supporting in-app notification feeds, pre-designed for future SMS gateway integration without touching core workflow logic.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router DOM, Axios
- **Backend**: Python, FastAPI, SQLAlchemy ORM, PyMySQL (with automatic SQLite fallback), Pydantic
- **Database**: MySQL / SQLite
- **Authentication**: Role-based JWT authentication (`FARMER`, `OPERATOR`, `ADMIN`) with PBKDF2 SHA256 password security

---

## 🔑 Demo Credentials

| Role | Mobile / Username | Password | Notes / Context |
| :--- | :--- | :--- | :--- |
| **Farmer** | `9876543210` | `farmer123` | Active Token `A101` (Completed Procurement) |
| **Farmer** | `9876543215` | `farmer123` | Token `A106` (Currently Processing) |
| **Farmer** | `9876543217` | `farmer123` | Token `A108` (Arrived / Waiting in Queue) |
| **Operator** | `8888888881` | `operator123` | Assigned to Pune Central APMC Mandi |
| **Administrator** | `9999999999` | `admin123` | Full System Analytics & Mandi Management |

*Note: You can also click the quick **"⚡ Demo Instant Logins"** buttons on the login page!*

---

## 🚀 How to Run Locally

### 1. Backend (FastAPI + SQLAlchemy)
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Install dependencies:
pip install -r requirements.txt

# Seed database with sample data:
python seed.py

# Start backend server:
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at: `http://127.0.0.1:8000/docs`

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Web Application will be available at: `http://localhost:5173`

---

## 📁 Directory Structure
```text
Farmer PS/
├── backend/
│   ├── app/
│   │   ├── models/        # SQLAlchemy ORM models (User, Farmer, Centre, Slot, Booking, Queue, Procurement, Payment, Notification)
│   │   ├── schemas/       # Pydantic validation schemas
│   │   ├── routes/        # REST APIs (Auth, Farmers, Centres, Crops, Slots, Bookings, Queue, Procurement, Payments, Notifications, Dashboards)
│   │   ├── services/      # Queue calculation, Auth JWT, Notification service
│   │   ├── database.py    # Database connection engine with MySQL auto-create & SQLite fallback
│   │   └── main.py        # FastAPI entrypoint
│   ├── seed.py            # Complete database seed script (20 farmers, 3 centres, 3 operators, slots, bookings, queues, procurements, payments)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Sidebar, Footer, QueueCard, StatCard, StatusBadge, Notification Popover
│   │   ├── context/       # AuthContext for JWT state & role protection
│   │   ├── services/      # Axios API client
│   │   ├── pages/         # Public, Farmer, Operator, Admin pages
│   │   ├── App.jsx        # Role-based protected routes
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```
