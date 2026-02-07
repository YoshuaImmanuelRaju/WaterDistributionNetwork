# 💧 Water Distribution Network (WDN) Management System

A full-stack web application for **uploading, visualizing, managing, analyzing, and exporting EPANET water distribution networks**.

This project is designed as an **engineering tool**, not just a visualization demo. It supports real workflows such as demand editing, alert monitoring, dashboard analysis, and structured data export.

---

## 🚀 Features

### 🌐 Core Functionality
- Upload EPANET `.inp` network files
- Persist uploaded networks across sessions
- Interactive network visualization (nodes & pipes)
- Zoom-adaptive, uncluttered rendering
- Node demand editing with live updates
- Color-coded pipes by diameter
- Alerts with severity and explanation
- Dashboard with system health overview
- Export network data (JSON / CSV)
- Export history tracking

---

## 🧠 Application Architecture

Frontend (React + Vite + TypeScript)
        ↓ REST API
Backend (FastAPI)
        ↓
EPANET .inp Parser / Network Builder

### Frontend
- React (SPA)
- Zustand (global state)
- React Flow (graph visualization)
- Tailwind CSS (styling)

### Backend
- FastAPI
- EPANET `.inp` file parsing
- REST endpoints for upload & updates

---

## 📁 Project Structure

.
├── backend/
│ ├── main.py # FastAPI entry point
│ ├── parser.py # EPANET .inp parser
│ └── requirements.txt
│
├── src/
│ ├── components/ # Reusable UI components
│ │ ├── Navbar.tsx
│ │ ├── Sidebar.tsx
│ │ └── StatCard.tsx
│ │
│ ├── pages/
│ │ └── User/
│ │ ├── Dashboard.tsx
│ │ ├── DemandManager.tsx
│ │ ├── Visualizer.tsx
│ │ └── ExportData.tsx
│ │
│ ├── store/
│ │ └── networkStore.ts # Zustand global store
│ │
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
│
├── package.json
├── vite.config.ts
└── README.md


---

## 🧰 Prerequisites

Make sure the following are installed on your system:

### Required
- **Node.js** ≥ 18
- **Python** ≥ 3.9
- **pip**
- **Git**

Check versions:
```bash
node -v
python3 --version
git --version

🖥️ Running the Project Locally
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

⚛️ Frontend Setup (React + Vite)
2️⃣ Install Dependencies
npm install


or (if you use pnpm):

pnpm install

3️⃣ Start Frontend Development Server
npm run dev


The frontend will be available at:

http://localhost:5173

🧪 Backend Setup (FastAPI)
4️⃣ Navigate to Backend Directory
cd backend

5️⃣ Create and Activate Virtual Environment (Recommended)
python3 -m venv venv
source venv/bin/activate


On Windows (PowerShell):

venv\Scripts\Activate.ps1

6️⃣ Install Backend Dependencies
pip install -r requirements.txt

7️⃣ Start the Backend Server
uvicorn main:app --reload


Backend will run at:

http://127.0.0.1:8000


Swagger API documentation:

http://127.0.0.1:8000/docs

🔗 Frontend ↔ Backend Connection

The frontend sends requests to:

http://127.0.0.1:8000


Example endpoint:

POST /networks/upload


Make sure the backend is running before uploading files.

📘 Application Pages Overview
🏠 Dashboard

System-level KPIs (nodes, pipes, demand, alerts)

Network health summary table

Detailed alert explanations

Quick navigation actions

🧮 Demand Manager

Upload .inp files

View uploaded networks

Select junction nodes

Edit and update demand values

Changes reflect instantly in the Visualizer

🗺️ Visualizer

Interactive EPANET network graph

Zoom-adaptive node sizing

Color-coded pipes by diameter

Alert highlighting with pulsing halo

Hover tooltips with node details

Network selection dropdown

📤 Export Data

Select data type:

Networks

Nodes

Alerts

Select export format:

JSON

CSV

Download data

View export history

🎨 Visualization Legend (Summary)
Nodes

⚪ Junction: Demand node

🟢 Tank: Storage

🔵 Reservoir: Source

🔴 Red outline & glow: Alert present

Pipes

🔴 Red: Small diameter (≤ 8)

🟠 Orange: Medium diameter (≤ 14)

🔵 Blue: Large diameter (> 14)

🟣 Dashed: Valve

🟢 Animated: Pump

📦 Export Formats
Data Type	JSON	CSV
Networks	✅	✅
Nodes	✅	✅
Alerts	✅	✅