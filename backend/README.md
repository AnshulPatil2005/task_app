# Backend (Node.js + Express)

## Features
- JWT authentication with role-based access (user, admin).
- Task CRUD with pagination, filtering, and text search.
- MongoDB via Mongoose with development seeding.
- Helmet, CORS, rate limiting, validation, and centralized error handling.
- Structured logging (Winston) and request logging (Morgan).
- Swagger UI and Postman collection.

## Getting Started
1. Copy environment variables: `cp .env.example .env`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. API base URL: `http://localhost:5000/api/v1`
5. Swagger: `http://localhost:5000/api/v1/docs`

## Scripts
- `npm run dev` — start with nodemon.
- `npm run start` — production start.
- `npm run lint` — run ESLint.

## Environment Variables
| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | HTTP port | `5000` |
| `MONGO_URL` | Mongo connection string | `mongodb://localhost:27017/intern_api` |
| `JWT_SECRET` | JWT signing secret | _required_ |
| `JWT_EXPIRES_IN` | Token lifetime | `1d` |
| `CORS_ORIGIN` | Allowed origins (comma separated) | `http://localhost:5173` |

## Seeding
When `NODE_ENV` is not `production`, default users are created if absent:
- Admin — `admin@demo.com` / `Admin@123`
- User — `user@demo.com` / `User@123`

## Structure
```
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  docs/swagger.yaml
```

## Tooling
- Swagger UI: `/api/v1/docs`
- Postman: `postman_collection.json`
