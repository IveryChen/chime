const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.error("VITE_API_URL is not defined in environment variables");
    // In production, we don't want a fallback
    if (import.meta.env.PROD) {
      throw new Error("API URL is not configured");
    }
    // Only use fallback in development
    return "http://localhost:8000/api";
  }
  return apiUrl;
};

export const API_URL = getApiUrl();
