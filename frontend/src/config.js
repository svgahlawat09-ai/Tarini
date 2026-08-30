// Tarini Frontend Configuration
// Uses relative URL in Vercel production deployment, or VITE_API_BASE_URL / localhost:8000 in dev
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    : import.meta.env.MODE === "production"
    ? ""
    : "http://localhost:8000";


