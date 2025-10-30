# Frontend (React + Vite)

## Features
- React Router with guarded routes for authenticated access.
- Zustand store persisting JWT and user data to `localStorage`.
- Axios client with automatic bearer token headers and 401 handling.
- Dashboard, task list with filters/pagination, and create/edit forms.
- Toast notifications powered by `react-hot-toast`.

## Getting Started
1. Copy `.env.example` to `.env`.
2. Install dependencies: `npm install`.
3. Start development server: `npm run dev`.
4. Visit `http://localhost:5173`.

## Scripts
- `npm run dev` — start Vite dev server.
- `npm run build` — create production build.
- `npm run preview` — preview production build locally.
- `npm run lint` — run ESLint.

## Environment Variables
| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api/v1`). |

## Auth Helpers
Auth state is kept in memory and synchronised to `localStorage`. Calling `clearAuth()` logs the user out and redirects to the login page.
