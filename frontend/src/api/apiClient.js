const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const apiClient = {
  async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail);
    }
    return response.json();
  },

  async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }
    return data;
  },
};
