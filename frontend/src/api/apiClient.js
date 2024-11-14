const API_URL = import.meta.env.PROD
  ? "https://chime-6r3r.onrender.com/api"
  : "http://localhost:8000/api";

export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    console.log("Making request to:", url); // Debug

    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include", // Important for CORS
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      // Log response headers for debugging
      console.log("Response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  },

  async get(endpoint) {
    return this.request(endpoint);
  },

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
