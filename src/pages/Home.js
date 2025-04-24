import React, { useEffect, useState } from "react";
import {
  getTrendingMovies,
  searchMovies,
  searchTVShows,
  searchMulti,
} from "../services/tmdbApi";
import { Container, Grid, Typography, Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ModernMovieCard from "../components/ModernMovieCard";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const data = await getTrendingMovies();
        setTrendingMovies(data.results);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching trending movies:", err);
        setError("Failed to fetch trending movies");
        setLoading(false);
      }
    };

    fetchTrendingMovies();
  }, []);

  const handleSearch = async (query, mediaType, filters = {}) => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsSearching(true);

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
          {(isSearching ? searchResults : trendingMovies).map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={item.id}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <ModernMovieCard movie={item} />
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>
    </Container>
  );
};

export default Home;
