const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

// Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("token");

// Helper to set JWT token in localStorage
const setToken = (token) => localStorage.setItem("token", token);

// Helper to remove JWT token
const removeToken = () => localStorage.removeItem("token");

// Helper to create headers with JWT
const getHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const authService = {
  // Email/password login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Backend returns: { success: true, message: "...", data: { token, user } }
      if (result.success && result.data) {
        setToken(result.data.token);
        return result.data; // Returns { token, user }
      }

      throw new Error("Invalid response format");
    } catch (error) {
      throw error;
    }
  },

  // Registration
  register: async (username, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      // Backend returns: { success: true, message: "...", data: { token, user } }
      if (result.success && result.data) {
        setToken(result.data.token);
        return result.data; // Returns { token, user }
      }

      throw new Error("Invalid response format");
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: getHeaders(),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to get user");
      }

      // Backend returns: { success: true, message: "...", data: { id, username, email } }
      return result.data; // Returns user object
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST", // Changed from GET to POST
        headers: getHeaders(),
      });
      const result = await response.json();

      removeToken(); // Clear token regardless of response

      if (!response.ok) {
        throw new Error(result.message || "Logout failed");
      }

      return result;
    } catch (error) {
      removeToken(); // Clear token even if request fails
      throw error;
    }
  },

  // Favorites (was "Watchlist")
  getFavorites: async () => {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch favorites");

      const result = await response.json();
      // Backend returns: { success: true, data: [{ id, movieId, addedAt }] }
      return result.data || [];
    } catch (error) {
      throw error;
    }
  },

  addToFavorites: async (movieId) => {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ movieId }),
      });

      if (!response.ok) throw new Error("Failed to add to favorites");

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  removeFromFavorites: async (movieId) => {
    try {
      const response = await fetch(`${API_URL}/favorites/${movieId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error("Failed to remove from favorites");

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  },

  // Kept legacy names for backward compatibility
  getWatchlist: async () => {
    return authService.getFavorites();
  },
  addToWatchlist: async (movieId) => {
    return authService.addToFavorites(movieId);
  },
  removeFromWatchlist: async (movieId) => {
    return authService.removeFromFavorites(movieId);
  },
};
