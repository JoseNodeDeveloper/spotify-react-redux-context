/**
 * Configuration is read once and validated.
 * Previously, the API URL was hardcoded manually in two different files
 * (services/config.js and services/auth/jwt/config.js).
 */
function readApiUrl(): string {
  const value = import.meta.env.VITE_API_URL as string | undefined;
  if (value) return value.replace(/\/$/, "");
  if (import.meta.env.MODE === "test") return "http://localhost/api/v1";
  throw new Error(
    "VITE_API_URL is missing. Copy .env.example to .env.",
  );
}

export const env = {
  apiUrl: readApiUrl(),
} as const;
