# AptiNexus frontend

React + TypeScript + Vite + Tailwind, Framer Motion, React Three Fiber, Recharts.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # type-check + production build
Copy `.env.example` to `.env`. `VITE_API_BASE_URL` points at the future FastAPI backend; `VITE_USE_MOCK=true` (default) uses demo data.

## Demo vs real
No backend, AI or verification exists yet. Resume analysis, career scores, gap priorities and quizzes are simple demo rules over sample data, and the UI labels them. User data is kept in browser localStorage through the mock adapter (`src/services/mock`). Passwords are never stored. Nothing is ever marked **Verified** automatically.

## Structure
`src/services/api` (REST client + modules) · `src/services/mock` (demo adapter) · `src/data` (sample catalogs) · `src/pages` · `src/components` · `src/contexts` · `src/hooks`.
The backend contract is in `docs/API_CONTRACT.md`. Pages for per-user data, login and the dashboard already go through the API layer; catalog pages (careers, skills, resources, assessments, graph) still import bundled sample data directly.
The original logo is kept untouched in `design/`; the app uses a downscaled copy of the same artwork.

## Not yet verified
Built and type-checked only. Not tested in a browser, on mobile, with a screen reader, or on a low-end GPU. Check the 3D SkillGraph and its 2D fallback first.
