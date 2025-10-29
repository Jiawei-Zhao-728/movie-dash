import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch watchlist on mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
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
    setLoading(true);
    try {
      await authService.addToWatchlist(movieId);
      await fetchWatchlist();
    } catch (err) {
      console.error("Failed to add to watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    setLoading(true);
    try {
      await authService.removeFromWatchlist(movieId);
      await fetchWatchlist();
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
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
