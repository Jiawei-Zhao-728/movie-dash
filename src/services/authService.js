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

      if (!response.ok) {
        let errorMsg = "Failed to get user";
        try {
          const result = await response.json();
          errorMsg = result.message || result.error || errorMsg;
        } catch (e) {
          // If response is not JSON, use status text
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
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

      if (!response.ok) {
        let errorMsg = "Failed to fetch favorites";
        try {
          const result = await response.json();
          errorMsg = result.message || result.error || errorMsg;
        } catch (e) {
          // If response is not JSON, use status text
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

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

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails (e.g., ERR_INCOMPLETE_CHUNKED_ENCODING), 
        // provide a more helpful error message
        const statusText = response.statusText || "Unknown error";
        throw new Error(`Server error (${response.status}): ${statusText}. Response may be incomplete.`);
      }
      
      if (!response.ok) {
        // Extract actual error message from backend ApiResponse format
        const errorMsg = result.message || result.error || "Failed to add to favorites";
        throw new Error(errorMsg);
      }

      return result.data;
    } catch (error) {
      // If error is already an Error object with message, rethrow it
      // Otherwise wrap it in a new Error
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error.message || "Failed to add to favorites");
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

  // Reviews
  /**
   * Get all reviews for a specific movie (public endpoint)
   * @param {number} movieId - The TMDb movie ID
   * @returns {Promise<Array>} Array of review objects
   */
  getMovieReviews: async (movieId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/movie/${movieId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMsg = "Failed to fetch reviews";
        try {
          const result = await response.json();
          errorMsg = result.message || result.error || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all reviews by the authenticated user
   * @returns {Promise<Array>} Array of review objects
   */
  getUserReviews: async () => {
    try {
      const response = await fetch(`${API_URL}/reviews/user`, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        let errorMsg = "Failed to fetch user reviews";
        try {
          const result = await response.json();
          errorMsg = result.message || result.error || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create or update a review
   * @param {number} movieId - The TMDb movie ID
   * @param {number} rating - Rating from 1 to 5
   * @param {string} comment - Optional review comment
   * @returns {Promise<Object>} The created or updated review
   */
  createReview: async (movieId, rating, comment = "") => {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ movieId, rating, comment }),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const statusText = response.statusText || "Unknown error";
        throw new Error(`Server error (${response.status}): ${statusText}. Response may be incomplete.`);
      }

      if (!response.ok) {
        const errorMsg = result.message || result.error || "Failed to create review";
        throw new Error(errorMsg);
      }

      return result.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(error.message || "Failed to create review");
    }
  },

  /**
   * Delete a review
   * @param {number} reviewId - The review ID to delete
   * @returns {Promise<void>}
   */
  deleteReview: async (reviewId) => {
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        let errorMsg = "Failed to delete review";
        try {
          const result = await response.json();
          errorMsg = result.message || result.error || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      throw error;
    }
  },
};
