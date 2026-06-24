# مسجدي - Masjidi Project

## Overview
A full-stack Masjid management system for teaching Quran and Islamic sciences. Built with the MERN stack (MongoDB, Express, React, Node.js) with Tailwind CSS, Font Awesome icons, and Arabic/RTL design.

## Architecture
- **Frontend**: React + Vite (port 5000) — `client/` directory
- **Backend**: Express.js API (port 8000) — `server/` directory
- **Database**: MongoDB Atlas (temporary dev connection — move to .env before production)
  - URI: `mongodb+srv://myvibecoding10_db_user:KB3cVZ6XBOJJRC1u@cluster0.wd8mbrw.mongodb.net/?appName=Cluster0`
- **Language**: Arabic only, RTL layout, Cairo/Amiri fonts

## Three Sides
1. **Public Side** — Homepage, Attendance page, Contact page
2. **Admin Dashboard** (`/admin`) — Full management interface
3. **Teacher Dashboard** (`/teacher`) — Teacher-specific tools

## Running the App
The single workflow `Start application` handles everything:
```bash
bash run.sh
```
This starts: MongoDB → Express backend (port 8000) → Vite frontend (port 5000)

## Default Credentials
- Admin: `admin@masjidi.com` / `admin123`
- To seed admin account: visit `/login` and click "إنشاء حساب المدير"

## Project Structure
```
client/          # React frontend
  src/
    pages/
      Public/    # HomePage, AttendancePage, ContactPage
      Admin/     # AdminDashboard and all admin sub-pages
      Teacher/   # TeacherDashboard and all teacher sub-pages
    components/
      shared/    # Header, Footer (reusable)
    context/     # AuthContext (JWT auth)
server/          # Express backend
  models/        # Mongoose models
  routes/        # API routes
  middleware/    # Auth middleware
Description_Mirror_Method/  # Original specifications
```

## User Preferences
- **Agent responses in English** (UI remains Arabic-only)
- Arabic-only UI, RTL direction
- Green Islamic color scheme with gold accents
- Cairo font family
- Font Awesome icons
- Tailwind CSS for styling
- MERN stack
