import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useAuth } from "./AuthContext";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch watchlist when user logs in or changes
  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      // Clear watchlist when user logs out
      setWatchlist([]);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      setWatchlist([]);
      return;
    }

    setLoading(true);
    try {
      const data = await authService.getWatchlist();
      // Backend returns array of favorites: [{ id, movieId, addedAt }]
      setWatchlist(data);
    } catch (err) {
      setWatchlist([]);
      console.error("Failed to fetch watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("User must be logged in to add to watchlist");
      alert("Please log in to add movies to your watchlist");
      return;
    }

    setLoading(true);
    try {
      await authService.addToWatchlist(movieId);
      await fetchWatchlist();
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
      // Show the actual error message from backend if available
      const errorMessage = err.message || "Failed to add to watchlist. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("User must be logged in to remove from watchlist");
      return;
    }

    setLoading(true);
    try {
      await authService.removeFromWatchlist(movieId);
      await fetchWatchlist();
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      alert("Failed to remove from watchlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isInWatchlist = (movieId) => {
    // Backend Favorite entity has `movieId` field, not `id`
    return watchlist.some((item) => item.movieId === movieId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        fetchWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
