# 🌊 AquaSense AI – Water Intelligence Platform

> **Next-Generation Enterprise AI Water Resource Management, Predictive Leak Detection, Digital Twin Stress Testing & Vector RAG Assistant**

AquaSense AI is an enterprise-grade Water Intelligence Platform designed to empower municipal authorities, water resource engineers, environmental analysts, and citizens with real-time predictive analytics, live hydrology telemetry, automated acoustic leak detection, and an AI Conversational Expert.

---

## 🌟 Key Features

### 1. 🤖 AquaSense AI Assistant ("Your Intelligent Water Management Expert")
- **Vector RAG Engine**: Cosine Similarity vector search across a 15-domain water engineering knowledge base (CGWB drawdown limits, CWC reservoir rule curves, BIS 10500 water quality standards, UN SDG 6 indicators, acoustic leak SOPs, IPCC climate models).
- **Digital Twin Scenario Simulator**: Interactive stress testing for $+20\%$ population growth, $-30\%$ rainfall drop, $-40\%$ reservoir loss, and industrial demand spikes.
- **Continuous Learning Loop**: Real-time feedback ingestion (Thumbs Up 👍 / Down 👎) and custom document upload pipeline to expand vector memory dynamically.
- **Multilingual & Voice AI**: Native support for English, Hindi (हिंदी), and Gujarati (ગુજરાતી) with Speech-to-Text (STT) voice queries and Text-to-Speech (TTS) response playback.
- **6 Persona Roles**: Tailored response depth and permissions for *Citizen, Field Worker, Engineer, Water Officer, Data Analyst,* and *Administrator*.

### 2. ⚡ Resilient Public API Integration Layer
Operates with **zero mandatory API keys** out of the box with in-memory TTL caching, exponential backoff retries, and multi-provider failover:
- **Weather & Climate**: Open-Meteo Forecast API & NASA POWER Climatology API.
- **Air & Environment**: Open-Meteo Air Quality API & OpenAQ v2.
- **Severe Disasters**: NASA Earth Observatory Natural Event Tracker (EONET v3).
- **Elevation & Terrain**: Open-Elevation Global DEM & OpenTopoData ETOPO1.
- **Geocoding & Location**: OpenStreetMap Nominatim & Photon Komoot APIs.
- **Hydrological Telemetry**: USGS National Water Information System (NWIS).

### 3. 📊 AI Water Risk Scoring & Predictive Analytics
- **Composite 0-100 Risk Score**: Dynamic calculation combining live 24h precipitation deficit, dam levels, groundwater depth, consumption velocity, active leaks, and population density.
- **Multi-Horizon Predictions**: 7-Day, 30-Day, and 90-Day shortage probabilities, supply runway estimation, and automated mitigation recommendations.
- **Leak Anomaly Matrix**: Acoustic drop & flow divergence anomaly scoring to isolate high-priority pipe bursts within 4 hours.

### 4. 🗺️ Interactive GIS Map & Operations Control Center
- High-performance Leaflet & OSM geospatial interface with real-time pipe leak markers, reservoir storage overlays, and drought risk polygons.
- Direct navigation triggers from AI Assistant actions (`Highlight Leaks on GIS Map`).

### 5. 🌿 Environmental Sustainability Tracker
- Automated calculation of **Water Conserved (Liters)**, **Energy Saved (kWh)**, **CO₂ Emissions Avoided (kg)**, **Rainwater Harvested**, **Groundwater Recharged**, and **UN SDG Goal 6 Compliance Index**.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Vite, TailwindCSS, Lucide Icons, Recharts, React Leaflet |
| **Backend API** | Node.js, Express, TypeScript, Prisma ORM, SQLite Database |
| **AI / ML & RAG** | Vector Embedding Engine, Cosine Similarity Retrieval, Isolation Forest, Gradient Boost |
| **Public APIs** | Open-Meteo, NASA POWER, OpenAQ, NASA EONET, Open-Elevation, Nominatim, USGS |
| **Voice & Speech** | Web Speech API (Speech-to-Text STT & SpeechSynthesis TTS) |

---

## 📁 Repository Structure

```
Water-Intelligence-Platform/
├── BACKEND/
│   ├── prisma/
│   │   └── schema.prisma           # Prisma Data Model (Reservoirs, Sensors, Leaks, AI Models)
│   ├── src/
│   │   ├── index.ts                # Express Server Entry Point
│   │   ├── routes/                 # REST API Endpoints
│   │   │   ├── external.ts         # Public API Service Router (Weather, AQI, Elevation, USGS)
│   │   │   ├── aiAssistant.ts      # AI Assistant & Digital Twin Endpoints
│   │   │   ├── advanced.ts         # ML Risk Engine & Multi-Horizon Predictions
│   │   │   └── admin.ts            # RBAC User Management & System Health
│   │   ├── services/
│   │   │   ├── aiEngine.ts         # Composite Water Risk Calculation Engine
│   │   │   ├── aiAssistantService.ts# Conversational RAG Reasoning Engine
│   │   │   ├── ragKnowledgeService.ts# 15-Domain Vector Store & Continuous Learning
│   │   │   └── external/           # Resilient API Providers (Weather, AQI, Disasters, USGS)
│   │   └── utils/
│   │       └── apiClient.ts        # Resilient HTTP Client (TTL Cache, Retries, Failover)
│   ├── package.json
│   └── tsconfig.json
│
└── aquasense-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── chat/
    │   │   │   └── AquaSenseAIAssistant.tsx # Interactive RAG AI Assistant & Digital Twin Modal
    │   │   └── shared/             # TopAppBar, Sidebar, BottomNavBar
    │   ├── pages/                  # Dashboard, AIPredictions, GISMap, Alerts, Reports, Admin
    │   ├── services/
    │   │   ├── apiServices.ts      # Main API Client Services
    │   │   ├── externalApi.ts      # External Public Data Services
    │   │   ├── aiAssistantApi.ts   # AI Assistant & Simulator API Client
    │   │   └── ragApi.ts           # Vector Search & Knowledge Ingestion Client
    │   └── layouts/                # MainLayout & AdminLayout
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Setup & Run Backend

```bash
cd BACKEND

# Install dependencies
npm install

# Initialize Prisma SQLite Database & generate client types
npx prisma db push
npx prisma generate

# Start the Backend Server (Runs on http://localhost:5000)
npx tsx watch src/index.ts
```

### 2. Setup & Run Frontend

```bash
cd aquasense-frontend

# Install dependencies
npm install

# Start Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

---

## 🔗 Key API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/external/weather` | `GET` | Live Open-Meteo & NASA POWER precipitation & temperature report |
| `/api/external/air-quality` | `GET` | Open-Meteo AQI & PM2.5 / PM10 metrics |
| `/api/external/disasters` | `GET` | Active severe flood, storm & wildfire alerts from NASA EONET |
| `/api/external/elevation` | `GET` | Terrain height lookup via Open-Elevation Global DEM |
| `/api/external/water-telemetry` | `GET` | Live streamflow MLD & river gauge height from USGS NWIS |
| `/api/advanced/ai/risk-score` | `GET` | Composite 0-100 ML Water Risk Score with live rainfall weighting |
| `/api/ai-assistant/chat` | `POST` | Conversational Vector RAG AI Assistant query endpoint |
| `/api/ai-assistant/simulate` | `POST` | Digital Twin scenario stress test simulator |
| `/api/ai-assistant/knowledge/ingest` | `POST` | Ingest custom policy documents into vector memory |
| `/api/ai-assistant/feedback` | `POST` | Submit upvote/downvote feedback for continuous learning |

---

## 🔒 Security & Performance Features

- **Role-Based Access Control (RBAC)**: Fine-grained permission enforcement across User Management and Executive Admin controls.
- **In-Memory TTL Caching**: Reduces public API network overhead and prevents rate throttling.
- **Type-Safe Verification**: 100% TypeScript coverage verified via `npx tsc --noEmit` across both frontend and backend projects.

---

## 📄 License

Distributed under the **ISC License**. Developed for **AquaSense AI – Water Intelligence Platform**.
