# EduPayTrack: Definitive Institutional Payment & Fee Management System

EduPayTrack is high-performance, automated platform designed to streamline student fee payments and administrative verification through AI-powered OCR scanning and statutory financial tracking.

---

## 🚀 Executive Feature Overview
- **AI OCR Scanning Engine**: Automated data extraction from payment receipts.
- **Stateless Session Security**: Role-based access control with session-synchronization across all roles (Admin, Accounts, Student).
- **Institutional Branding Platform**: Full white-labeling capability for name, logo, and registry data directly from the system UI.
- **Advanced High-Density Analytics**: Real-time reporting on collection velocity, installment rates, and departmental financial tracking.

---

## ⚙️ Technical Architecture

### 🛡️ Backend API Core (Node.js/Express)
The backend manages the platform's security, data persistence, and OCR bridge.
- **Stateless Authentication**: Uses JWT for secure, efficient session management.
- **ORM Persistence**: Prisma with PostgreSQL ensures strict data integrity for the student ledger.
- **Audit Trails**: Real-time logging of all personnel actions for institutional accountability.

### 🎨 Frontend Visual Terminal (React + Vite)
The UI is built for administrative efficiency and student ease-of-use.
- **Glassmorphic Design**: Modern, premium UI utilizing HSL color tokens and micro-animations.
- **Responsive Workspace**: Optimized for every screen size, from 375px mobile phones to 4K monitors.
- **Unified Routing**: Role-specific navigation that protects sensitive institutional data.

---

## 🛠️ Global Setup & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** Database
- **NPM** or **Yarn**

### 2. Environment Configuration
Create a `.env` file in the `backend/` directory based on the `.env.example` provided.

### 3. Installation & Preparation
```bash
# Setup the API Layer
cd backend && npm install
npx prisma generate
npx prisma db push

# Setup the UI Layer
cd ../frontend && npm install
```

### 4. Running the Complete Platform
Open two terminals to run both layers concurrently:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---

## 📊 Documentation & Progress
For an in-depth analysis of the system architecture, developmental methodology (Iterative Bottom-Up), and the 100% SRS compliance matrix, please see the definitive document:
- [**Documentation**](./GLOBAL_SYSTEM_ANALYSIS.md): Definitive system analysis and SRS compliance report.

---
**Status**: ✅ Institutional Production Ready  
**Version**: 1.0.0  
*EduPayTrack System - Build Confirmed: March 30, 2026*
