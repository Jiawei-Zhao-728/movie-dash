import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Check if we're handling a callback
        const searchParams = new URLSearchParams(location.search);
        console.log(
          "Current URL parameters:",
          Object.fromEntries(searchParams.entries())
        );

        if (searchParams.has("token")) {
          console.log("Found token in URL, handling callback...");
          try {
            const userParam = searchParams.get("user");
            console.log("User data from URL:", userParam);

            const result = await authService.handleCallback(searchParams);
            console.log("Callback result:", result);

            if (result && result.user) {
              console.log("Setting user state:", result.user);
              setUser(result.user);
              localStorage.setItem("token", result.token);
              // Clear the URL parameters and redirect
              navigate("/", { replace: true });
              return;
            } else {
              console.log("No user data in callback result");
            }
          } catch (error) {
            console.error("Error handling callback:", error);
            localStorage.removeItem("token");
            setUser(null);
          }
        }

        // Check for existing token
        const token = localStorage.getItem("token");
        if (token) {
          console.log("Found existing token, verifying...");
          try {
            const response = await authService.verifyToken(token);
            console.log("Token verification response:", response);
            if (response && response.user) {
              console.log("Setting user from verified token:", response.user);
              setUser(response.user);
            } else {
              console.log("Token verification returned no user data");
              localStorage.removeItem("token");
              setUser(null);
            }
          } catch (error) {
            console.error("Token verification failed:", error);
            localStorage.removeItem("token");
            setUser(null);
          }
        } else {
          console.log("No token found in localStorage");
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [location, navigate]);

  const login = async () => {
    try {
      setLoading(true);
      console.log("Initiating login process...");
      const authUrl = await authService.getGoogleAuthUrl();
      console.log("Redirecting to auth URL:", authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("Logging out...");
      await authService.logout();
      localStorage.removeItem("token");
      setUser(null);
      console.log("Logout successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("Current auth state:", { user, loading });

  const value = {
    user,
    loading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
