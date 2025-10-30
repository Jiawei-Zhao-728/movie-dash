import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  getTrendingMovies,
  searchMovies,
  searchTVShows,
  searchMulti,
} from "../services/tmdbApi";
import { Container, Grid, Typography, Box, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ModernMovieCard from "../components/ModernMovieCard";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const lastMovieRef = useRef(null);

  // Fetch initial trending movies
  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const data = await getTrendingMovies(1);
        setTrendingMovies(data.results);
        setHasMore(data.page < data.total_pages);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
        setError("Failed to fetch trending movies");
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  // Load more trending movies
  const loadMoreTrendingMovies = useCallback(async () => {
    if (loadingMore || !hasMore || isSearching) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await getTrendingMovies(nextPage);
      setTrendingMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      console.error("Error loading more movies:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore, isSearching]);

  // Load more search results
  const loadMoreSearchResults = useCallback(async (query, mediaType, filters) => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = searchPage + 1;
      let data;
      const params = {
        query,
        with_genres: filters.genres?.join(","),
        "primary_release_date.gte": filters.startDate,
        "primary_release_date.lte": filters.endDate,
      };

      switch (mediaType) {
        case "movie":
          data = await searchMovies(query, nextPage, params);
          break;
        case "tv":
          data = await searchTVShows(query, nextPage, params);
          break;
        default:
          data = await searchMulti(query, nextPage, params);
      }

      setSearchResults((prev) => [...prev, ...data.results]);
      setSearchPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      console.error("Error loading more search results:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [searchPage, hasMore, loadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading) return;

    const options = {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        if (isSearching) {
          // Store current search params - you'll need to pass these from handleSearch
          // For now, we'll just trigger the trending movies load
          loadMoreTrendingMovies();
        } else {
          loadMoreTrendingMovies();
        }
      }
    }, options);

    if (lastMovieRef.current) {
      observerRef.current.observe(lastMovieRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, loadingMore, isSearching, loadMoreTrendingMovies]);

  const handleSearch = async (query, mediaType, filters = {}) => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);
    setSearchPage(1);

    try {
      let data;
      const params = {
        query,
        with_genres: filters.genres?.join(","),
        "primary_release_date.gte": filters.startDate,
        "primary_release_date.lte": filters.endDate,
      };

      switch (mediaType) {
        case "movie":
          data = await searchMovies(query, 1, params);
          break;
        case "tv":
          data = await searchTVShows(query, 1, params);
          break;
        default:
          data = await searchMulti(query, 1, params);
      }
      setSearchResults(data.results);
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      console.error("Error searching:", err);
      setError("Failed to search");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setIsSearching(false);
    setSearchResults([]);
    setSearchPage(1);
    setHasMore(true);
  };

  if (loading)
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography>Loading...</Typography>
      </Container>
    );

  if (error)
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          mb: 6,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-16px",
            left: "0",
            width: "60px",
            height: "4px",
            backgroundColor: "primary.main",
            borderRadius: "2px",
          },
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #1976d2, #90caf9)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            mb: 2,
          }}
        >
          Welcome to Movie Dash
        </Typography>
        <Typography
          variant="h4"
          component={motion.h2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          sx={{
            color: "text.secondary",
            fontWeight: 500,
            letterSpacing: "0.5px",
          }}
        >
          {isSearching ? "Search Results" : "Trending Movies"}
        </Typography>
      </Box>

      <SearchBar onSearch={handleSearch} onBack={handleBack} />

      <AnimatePresence mode="wait">
        <Grid container spacing={3}>
          {(isSearching ? searchResults : trendingMovies).map((item, index) => {
            const isLastItem = index === (isSearching ? searchResults : trendingMovies).length - 1;
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={`${item.id}-${index}`}
                ref={isLastItem ? lastMovieRef : null}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ModernMovieCard movie={item} />
              </Grid>
            );
          })}
        </Grid>
      </AnimatePresence>

      {/* Loading indicator for infinite scroll */}
      {loadingMore && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* End of results indicator */}
      {!hasMore && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No more movies to load
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;
