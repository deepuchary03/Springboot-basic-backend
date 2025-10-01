// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
};

// Default headers for API requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// API utility functions
export const apiRequest = async (url, options = {}) => {
  const config = {
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error("API Request failed:", error);
    throw new Error(
      "Network error. Please check your connection and try again."
    );
  }
};
