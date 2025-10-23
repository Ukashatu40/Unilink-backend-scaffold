# Smart Travel Insights — Backend Scaffold


Quick scaffold for the Node/Express backend. Features:
- MongoDB (Mongoose) user model
- JWT auth (register/login)
- `/weather/:city` — proxy to OpenWeatherMap
- `/traffic/:city` — mocked traffic data (swap for real provider)
- `/reviews/sentiment` — calls FastAPI sentiment microservice (or returns mocked response)


## Setup
1. Copy `.env.example` to `.env` and fill values.
2. `npm install`
3. `npm run dev` (requires nodemon) or `npm start`


## Notes
- This scaffold uses MongoDB for speed during prototyping. If you prefer PostgreSQL, I can produce an equivalent Prisma/Knex version.
- FastAPI service expected at `FASTAPI_URL` env var. If not present, sentiment endpoint returns a mocked response.




// End of scaffold
# Smart Travel Insights

## Overview
Full stack app: React (Vite) frontend, Node/Express backend, FastAPI ML microservice, MongoDB.

## Local dev (backend)
cd backend
cp .env.example .env
# set OPENWEATHER_API_KEY, MONGODB_URI, JWT_SECRET, FASTAPI_URL
npm install
npm run dev

## Local dev (frontend)
cd frontend
cp .env.example .env
# set VITE_API_BASE_URL to http://localhost:4000
npm install
npm run dev

## Export endpoints
GET /export/search-history?format=csv|pdf (protected)
GET /export/sentiment-history?format=csv|pdf (protected)
Use Authorization: Bearer <token>

## Docker
docker-compose up --build

## Tests
cd backend
npm test
