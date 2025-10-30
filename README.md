# Task Management Monorepo

## Overview
Node.js/Express REST API with a Vite/React client for managing tasks with JWT authentication and role-based access control.

## Prerequisites
- Node.js >= 18
- npm >= 9
- MongoDB >= 6

## Environment Variables
1. Copy `backend/.env.example` to `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Update values to match your environment (ports, secrets, Mongo connection string).

## Local Development
### Backend
- `cd backend && npm install`
- `npm run dev`
- API: `http://localhost:5000/api/v1`
- Swagger: `http://localhost:5000/api/v1/docs`
- Postman collection: `backend/postman_collection.json`

### Frontend
- `cd frontend && npm install`
- `npm run dev`
- App: `http://localhost:5173`

### Seeded Accounts
Development mode seeds two users automatically if missing:
- Admin — `admin@demo.com` / `Admin@123`
- User — `user@demo.com` / `User@123`

## Testing & Linting
- Backend lint: `cd backend && npm run lint`
- Frontend lint: `cd frontend && npm run lint`

## Swagger
Swagger UI lives at `http://localhost:5000/api/v1/docs`.

## Postman
Import `backend/postman_collection.json`, set the `base_url` and `jwt` variables, and you’re ready to call every endpoint.

## Scalability Notes
- Split the system into dedicated microservices (auth, tasks) behind an API gateway.
- Introduce Redis for caching auth tokens, rate-limit counters, and popular task queries.
- Terminate TLS and balance traffic with NGINX, HAProxy, or a managed load balancer.
- Deploy via container orchestration (Kubernetes) with horizontal pod autoscaling and managed MongoDB clusters.
