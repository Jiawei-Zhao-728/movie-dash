import React, { useEffect, useState } from "react";
import {
  getTrendingAll,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "../services/tmdbApi";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Fade,
  Fab,
  Tooltip,
} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import MovieCarousel from "../components/MovieCarousel";
import MovieComparison from "../components/MovieComparison";
import { tokens, flexCenter } from "../theme";

/**
 * Home Page Component
 *
 * Main landing page featuring a hero section and multiple categorized movie carousels.
 * Fetches data from TMDB API for various movie categories and displays them in
 * horizontally scrollable carousels.
 *
 * Data Fetching Strategy:
 * - All API calls made in parallel using Promise.all for optimal performance
 * - Fetches on component mount only (empty dependency array)
 * - Error handling with user-friendly error UI
 * - Loading state with centered spinner
 *
 * Sections Displayed:
 * 1. Hero Section - Top 5 trending items with auto-rotation
 * 2. Trending Now - Items 6-25 from trending
 * 3. Popular on MovieDash - Popular movies
 * 4. Top Rated - Critically acclaimed content
 * 5. Now Playing in Theaters - Current theatrical releases
 * 6. Coming Soon - Upcoming releases
 *
 * @example
 * <Route path="/" element={<Home />} />
 */
const Home = () => {
  // State for different movie categories from TMDB API
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  // UI state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonOpen, setComparisonOpen] = useState(false);

  /**
   * Fetch all movie categories on component mount
   * Uses Promise.all for parallel fetching to optimize loading time
   * Handles errors gracefully with user-friendly error message
   */
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);

        // Fetch all categories in parallel for optimal performance
        // Each API call fetches page 1 with ~20 results
        const [trending, popular, topRated, upcoming, nowPlaying] = await Promise.all([
          getTrendingAll(1),
          getPopularMovies(1),
          getTopRatedMovies(1),
          getUpcomingMovies(1),
          getNowPlayingMovies(1),
        ]);

        // Update state with results, fallback to empty array if undefined
        setTrendingMovies(trending.results || []);
        setPopularMovies(popular.results || []);
        setTopRatedMovies(topRated.results || []);
        setUpcomingMovies(upcoming.results || []);
        setNowPlayingMovies(nowPlaying.results || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to fetch movies. Please try again later.");
        setLoading(false);
      }
    };

    fetchAllMovies();
  }, []); // Empty dependency array - fetch only on mount


  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          ...flexCenter(),
          minHeight: "100vh",
          backgroundColor: tokens.colors.dark[800],
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress
            size={60}
            sx={{
              color: tokens.colors.brand.primary,
              mb: 3,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: tokens.colors.light[300],
              fontWeight: tokens.typography.fontWeight.medium,
            }}
          >
            Loading amazing content...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            backgroundColor: tokens.colors.dark[700],
            borderRadius: tokens.borderRadius.xl,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: tokens.colors.semantic.error,
              mb: 2,
              fontWeight: tokens.typography.fontWeight.bold,
            }}
          >
            Oops! Something went wrong
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: tokens.colors.light[400] }}
          >
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.dark[800],
        pb: 8,
      }}
    >
      {/* Main Browse View */}
      <Fade in={true}>
        <Box>
            {/* Hero Section */}
            <HeroSection movies={trendingMovies.slice(0, 5)} />

            {/* Floating Action Button for Movie Comparison */}
            <Tooltip title="Compare Movies" placement="left">
              <Fab
                color="primary"
                aria-label="compare"
                onClick={() => setComparisonOpen(true)}
                sx={{
                  position: "fixed",
                  bottom: 32,
                  right: 32,
                  background: tokens.gradients.primary,
                  boxShadow: `0 8px 24px ${tokens.colors.brand.primary}40`,
                  transition: tokens.transitions.all,
                  "&:hover": {
                    transform: "scale(1.1) rotate(180deg)",
                    boxShadow: `0 12px 32px ${tokens.colors.brand.primary}60`,
                  },
                }}
              >
                <CompareArrowsIcon />
              </Fab>
            </Tooltip>

            {/* Movie Carousels */}
            <Container maxWidth="xl" sx={{ mt: -8 }}>
              {/* Trending Now */}
              {trendingMovies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <MovieCarousel
                    title="Trending Now"
                    subtitle="What's hot this week"
                    movies={trendingMovies.slice(5, 25)}
                  />
                </motion.div>
              )}

              {/* Popular Movies */}
              {popularMovies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <MovieCarousel
                    title="Popular on MovieDash"
                    subtitle="Crowd favorites"
                    movies={popularMovies}
                  />
                </motion.div>
              )}

              {/* Top Rated */}
              {topRatedMovies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <MovieCarousel
                    title="Top Rated"
                    subtitle="Critically acclaimed"
                    movies={topRatedMovies}
                  />
                </motion.div>
              )}

              {/* Now Playing */}
              {nowPlayingMovies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <MovieCarousel
                    title="Now Playing in Theaters"
                    subtitle="In cinemas now"
                    movies={nowPlayingMovies}
                  />
                </motion.div>
              )}

              {/* Coming Soon */}
              {upcomingMovies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <MovieCarousel
                    title="Coming Soon"
                    subtitle="Upcoming releases"
                    movies={upcomingMovies}
                  />
                </motion.div>
              )}
            </Container>
          </Box>
        </Fade>

        {/* Movie Comparison Modal */}
        <MovieComparison
          open={comparisonOpen}
          onClose={() => setComparisonOpen(false)}
        />
    </Box>
  );
};

export default Home;
