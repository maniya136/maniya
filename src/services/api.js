import axios from "axios";

// API configuration
const API_URL = "https://localhost:7253/api"; // Base URL to your .NET API

// Create axios instance with default config
// Update the axios instance configuration
const api = axios.create({
  baseURL: "https://unsynonymously-unreveling-lauri.ngrok-free.dev/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
  timeout: 10000, // Add a timeout
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;

      if (status === 401) {
        // Handle unauthorized
        console.error("Unauthorized access - please log in");
        // Optionally redirect to login
        // window.location.href = '/login';
      } else if (status === 404) {
        console.error("The requested resource was not found");
      } else if (status >= 500) {
        console.error("Server error occurred");
      }

      // Return a more user-friendly error message
      return Promise.reject({
        message: data?.message || `Request failed with status ${status}`,
        status,
        data: data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server");
      return Promise.reject({
        message: "No response from server. Please check your connection.",
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request setup error:", error.message);
      return Promise.reject({
        message: "Error setting up request. Please try again.",
      });
    }
  }
);

// User related API calls
export const userApi = {
  register: async (userData) => {
    try {
      console.log("Sending registration request with data:", userData);
      const response = await api.post("/Users/register", userData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: false, // Disable credentials for this request if not needed
      });
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      // Return the full error response for better debugging
      throw (
        error.response?.data ||
        error.message || { message: "Registration failed. Please try again." }
      );
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/Users/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw (
        error.response?.data || {
          message: "Login failed. Please check your credentials.",
        }
      );
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/Users/me");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      throw error.response?.data || { message: "Failed to load user profile" };
    }
  },

  updateProfile: async (payload) => {
    try {
      const response = await api.put("/Users/me", payload);
      return response.data;
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw (
        error.response?.data || { message: "Failed to update user profile" }
      );
    }
  },
};

// Custom Events API
export const customEventsApi = {
  create: async (eventData) => {
    try {
      const response = await api.post("/CustomEvents/create", eventData);
      return response.data;
    } catch (error) {
      console.error("Failed to create custom event:", error);
      throw (
        error.response?.data || { message: "Failed to create custom event" }
      );
    }
  },

  getAll: async () => {
    try {
      const response = await api.get("/CustomEvents");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch custom events:", error);
      throw (
        error.response?.data || { message: "Failed to fetch custom events" }
      );
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/CustomEvents/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch custom event:", error);
      throw error.response?.data || { message: "Failed to fetch custom event" };
    }
  },
};

// Personal Events API
export const personalEventsApi = {
  create: async (eventData) => {
    try {
      const response = await api.post("/PersonalEvents", eventData);
      return response.data;
    } catch (error) {
      console.error("Failed to create personal event:", error);
      throw (
        error.response?.data || { message: "Failed to create personal event" }
      );
    }
  },

  getAll: async () => {
    try {
      const response = await api.get("/PersonalEvents");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch personal events:", error);
      throw (
        error.response?.data || { message: "Failed to fetch personal events" }
      );
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/PersonalEvents/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch personal event:", error);
      throw (
        error.response?.data || { message: "Failed to fetch personal event" }
      );
    }
  },

  getByUserId: async (userId) => {
    try {
      const response = await api.get(`/PersonalEvents/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch personal events by user:", error);
      throw (
        error.response?.data || { message: "Failed to fetch personal events" }
      );
    }
  },
};

// Export the configured axios instance
export default api;
