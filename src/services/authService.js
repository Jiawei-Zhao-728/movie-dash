const API_URL = "http://127.0.0.1:5000";

export const authService = {
  // Get Google OAuth URL
  getGoogleAuthUrl: async () => {
    try {
      console.log("Requesting auth URL from:", `${API_URL}/auth/google/url`);
      const response = await fetch(`${API_URL}/auth/google/url`, {
        credentials: "include", // Important: include credentials for session cookie
      });
      const data = await response.json();
      console.log("Received auth URL response:", data);
      if (data.error) {
        throw new Error(data.error);
      }
      return data.url;
    } catch (error) {
      console.error("Error getting auth URL:", error);
      throw error;
    }
  },

  // Handle OAuth callback
  handleCallback: (searchParams) => {
    try {
      console.log(
        "Handling callback with params:",
        Object.fromEntries(searchParams.entries())
      );
      const token = searchParams.get("token");
      const userStr = searchParams.get("user");
      const error = searchParams.get("error");

      if (error) {
        console.error("Error from OAuth callback:", error);
        throw new Error(error);
      }

      if (!token || !userStr) {
        console.error("Missing token or user data in callback");
        throw new Error("Invalid callback data");
      }

      try {
        const user = JSON.parse(userStr);
        console.log("Parsed user data:", user);
        return { token, user };
      } catch (e) {
        console.error("Error parsing user data:", e);
        throw new Error("Invalid user data format");
      }
    } catch (error) {
      console.error("Callback handling error:", error);
      throw error;
    }
  },

  // Verify JWT token
  verifyToken: async (token) => {
    try {
      console.log("Verifying token...");
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Important: include credentials for session cookie
      });

      if (!response.ok) {
        console.error("Token verification failed:", response.status);
        throw new Error("Token verification failed");
      }

      const data = await response.json();
      console.log("Token verification response:", data);
      return data;
    } catch (error) {
      console.error("Token verification error:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      console.log("Sending logout request...");
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Important: include credentials for session cookie
      });

      if (!response.ok) {
        console.error("Logout failed:", response.status);
        throw new Error("Logout failed");
      }

      const data = await response.json();
      console.log("Logout response:", data);
      return data;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
};
