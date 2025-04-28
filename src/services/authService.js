const API_URL = "http://127.0.0.1:5000";

export const authService = {
  // Email/password login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      return data;
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
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Watchlist
  getWatchlist: async () => {
    try {
      const response = await fetch(`${API_URL}/movies/watchlist`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch watchlist");
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  addToWatchlist: async (movieId) => {
    try {
      const response = await fetch(`${API_URL}/movies/watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ movieId }),
      });
      if (!response.ok) throw new Error("Failed to add to watchlist");
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
  removeFromWatchlist: async (movieId) => {
    try {
      const response = await fetch(`${API_URL}/movies/watchlist`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ movieId }),
      });
      if (!response.ok) throw new Error("Failed to remove from watchlist");
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
