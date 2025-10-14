// File: README.md
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