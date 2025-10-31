# Tradiscope

**AI-powered trading assistant & analytics dashboard**
[Live Demo](https://tradiscope-mi2h.onrender.com/)

Tradiscope is a full-stack web application built to support traders by providing:

* Market bias analysis (bullish / bearish / neutral) using AI.
* Real-time news & insights on forex, commodities, indices.
* Trade-plan builder with AI review (trade ideas + risk/reward).
* Risk calculators (portfolio risk, leverage/margin, compounding, etc).

---

## 🧱 Architecture & Tech Stack

* **Frontend**: React (Vite) + Tailwind CSS + Framer Motion + Lucide Icons.
* **Backend**: Node.js (ESM modules) + Express + CORS + dotenv.
* **APIs used**:

  * OpenRouter (LLM model) for bias and trade-plan review.
  * Google's Gemini Flash 2.5 for Improvements-suggestion.
  * NewsData API for retrieving latest market news.
  * Various internal calculators built in React for risk/position sizing.
* **Deployment**: Hosted on Render — Web Service for backend, Static Site for frontend.

---

## 🧭 Project Structure

```
TRADISCOPE/
 ├─ client/            → React (Vite) frontend  
 │    ├─ src/
 │    │    ├─ pages/       (Bias, News, Plan, Calculator, Home)  
 │    │    ├─ components/  (UI, calculators, forms)  
 │    │    ├─ context/     (TradeContext)  
 │    │    └─ hooks/       (custom hooks like useFetchNews)  
 ├─ server/            → Express backend  
 │    ├─ routes/         (bias.js, news.js, plan.js, etc)  
 │    ├─ server.js       (entrypoint)  
 │    └─ .env            (local environment variables)  
 ├─ README.md          ← this file  
 └─ notes.txt          (misc developer notes)  
```

---

## 🔧 Local Setup

### Prerequisites

* Node.js v18+
* npm or yarn
* API keys for OpenRouter , NewsData and Gemini Flash from Google's AI Studio

### Run backend locally

```bash
cd server  
npm install  
cp .env.example .env  
# then set in .env:  
# OPENROUTER_API_KEY=<your_key>  
# NEWSDATA_API_KEY=<your_key>  
npm start  
```

The backend will run on `http://localhost:5000` by default.

### Run frontend locally

```bash
cd client  
npm install  
# Set in client/.env:  
# VITE_API_BASE_URL=http://localhost:5000  
npm run dev  
```

Open your browser at `http://localhost:5173`.

---

## ☁️ Deployment (Render)

### 1. Backend

* Create a Web Service on Render, link GitHub repo.
* Set Root Directory to `server`.
* Command: `npm install`
* Start command: `npm start`
* Add environment variables in Render:

  ```
  OPENROUTER_API_KEY=<your_key>
  NEWSDATA_API_KEY=<your_key>
  NODE_ENV=production
  ```
* Deploy. Once ready, you’ll have a URL like: `https://your-backend.onrender.com`.

### 2. Frontend

* Create a Static Site on Render, link same repo.
* Set Root Directory to `client`.
* Build command: `npm run build` (Vite)
* Publish directory: `dist` or the `build` folder.
* Add environment variable:

  ```
  VITE_API_BASE_URL=https://your-backend.onrender.com
  ```
* Deploy. You’ll have a live frontend URL like `https://tradiscope-mi2h.onrender.com`.

---

## 📐 Features Overview

| Feature                | Description                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Market Bias**        | Submit an asset (e.g., XAUUSD, EURUSD) → backend queries OpenRouter model → returns bias (Bullish/Bearish/Neutral) + reason.               |
| **News & Insights**    | Fetch latest market news via NewsData API; optionally filter by trading pair for relevant content.                                         |
| **Trade Plan Builder** | Form to create a trade plan (entry, stop, target, risk %, confidence) → optionally AI review to get suggestions & risk/reward analysis.    |
| **Risk Calculators**   | Suite of tools: Portfolio Risk Analyzer, Leverage & Margin Calculator, Compounding Projection, Multi-Trade Optimizer, Outcome Probability. |
| **Responsive UI**      | All components are responsive across mobile, tablet, desktop; charts scale fluidly; dark theme consistent.                                 |

---

## 🔒 Environment Variables

### Backend (`.env` in `/server`)

```
OPENROUTER_API_KEY=sk-…  
GEMINI_API_KEY=Adsd…  
NEWSDATA_API_KEY=pub_…  
NODE_ENV=production
```

### Frontend (`.env` in `/client`)

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

---

## 🧪 Troubleshooting & Notes

* **500 errors** from `/api/bias` often mean missing/wrong `OPENROUTER_API_KEY`. Check Render logs.
* If bias returns no valid JSON, the model might output free-text. Ensure you parse safely (JSON.parse fallback).
* For the news endpoint, some pairs yield **zero results** in NewsData API (totalResults = 0). The frontend UI should detect empty arrays and refresh/fallback to general news.
* CORS issues: backend uses `app.use(cors({ origin: "*", methods: ["GET", "POST"] }));` — restrict origin in production if desired.
* Local vs production ports: backend uses `process.env.PORT || 5000`. Do *not* use `import.meta.env` in Node.js.
* Rate limits: NewsData free tier may limit requests per day; design UI to handle fallback or cached data.

---

## 📝 License & Contribution

This project is open-source. Feel free to fork, submit pull requests or issues.
Please keep API keys private and don’t commit .env files.

---

Thank you for exploring Tradiscope! If you have feedback or find bugs, happy to help.
