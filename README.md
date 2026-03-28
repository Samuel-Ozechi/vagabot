# VagaBot — AI Travel Planner

## Live Demo

* Frontend: [https://vagabot-ui.onrender.com/](https://vagabot-ui.onrender.com/)
* Backend API Docs: [https://vagabot-m96k.onrender.com/docs](https://vagabot-m96k.onrender.com/docs)

---

## Overview

VagaBot is an AI-powered travel planning system that generates detailed, personalized travel itineraries using multi-agent orchestration.

It combines LLM reasoning with real-time external data sources such as weather, currency exchange rates and location intelligence to produce comprehensive travel plans.

---

## Key Features

*  Intelligent travel itinerary generation
*  Real-time weather integration
*  Currency conversion support
*  Location and places discovery
*  Budget-aware trip planning
*  Multi-tool orchestration via LangGraph
*  Full-stack deployment (FastAPI + Next.js)
*  Export itenery in pdf format

---

##  Architecture

```
Frontend (Next.js / React)
        ↓
FastAPI Backend (Render)
        ↓
LangGraph Agent Workflow
        ↓
External APIs (Weather, Places, Currency, etc.)
```

---

##  Tech Stack

### Backend

* FastAPI
* LangGraph
* LangChain
* Groq / OpenAI LLMs
* Python

### Frontend

* Next.js (React)
* Tailwind CSS
* Framer Motion

### APIs & Services

* OpenWeather API
* Google Places API
* Google Maps API
* Tavily Search API
* Exchange Rate API
* Foursquare Places API
* Groq/ Open AI LLMs

---

##  Environment Variables

Create a `.env` file in the backend root and add:

```

GROQ_API_KEY=""
# OR
OPENAI_API_KEY=""

GOOGLE_PLACES_API_KEY=""
TAVILY_API_KEY=""
OPEN_WEATHER_API_KEY=""
EXCHANGE_RATE_API_KEY=""
FOURSQUARE_PLACES_API_KEY=""
GOOGLE_MAPS_API_KEY=""
```

---

## Running Locally

### 1️ Clone the Repository

```
git clone https://github.com/your-username/vagabot.git
cd vagabot
```

---

### 2️ Backend Setup

```
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Run backend:

```
uvicorn main:app --reload
```

API available at:

```
http://127.0.0.1:8000/docs
```

---

### 3️ Frontend Setup

```
cd frontend
npm install
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## API Usage

### POST `/api/v1/plan-trip`

#### Request:

```
{
  "question": "Plan a 5 day trip to Lagos"
}
```

#### Response:

```
{
  "status": "success",
  "data": {
    "query": "...",
    "response": "Generated itinerary..."
  }
}
```

---

## How It Works

1. User submits a travel query
2. LangGraph agent processes the request
3. Tools are dynamically invoked:

   * Weather lookup
   * Place search
   * Currency conversion
4. Results are aggregated
5. Final structured itinerary is generated

---

## Use Cases

* Travel planning assistants
* AI-powered concierge systems
* Tourism platforms
* Personal productivity tools

---

## Deployment

### Backend

* Hosted on Render

### Frontend

* Hosted on Render 

---


---

## 🧩 Future Improvements

* Chat-style conversational UI
* Streaming responses
* Map integration (Google Maps)
* User personalization & memory

---

## 👤 Author

Samuel Ozechi

* Portfolio: [https://samuel-ozechi.github.io/](https://samuel-ozechi.github.io/)
* Email: [ozechisamuel@gmail.com](mailto:ozechisamuel@gmail.com)

---

## 📄 License

This project is open-source and available under the MIT License.
