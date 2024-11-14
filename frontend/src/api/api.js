// api.js
const isProd = import.meta.env.PROD;
const API_URL = (() => {
  const configuredUrl = import.meta.env.VITE_API_URL;
  if (!configuredUrl) {
    if (isProd) {
      throw new Error("API URL not configured in production");
    }
    return "http://localhost:8000/api";
  }
  return configuredUrl;
})();

console.log("Current API_URL:", API_URL); // Debug
console.log("Environment:", isProd ? "production" : "development"); // Debug

export { API_URL };
