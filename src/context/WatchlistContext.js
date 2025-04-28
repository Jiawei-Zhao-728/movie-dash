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
      setWatchlist(data);
    } catch (err) {
      setWatchlist([]);
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
      // handle error
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
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((item) => item.id === movieId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
