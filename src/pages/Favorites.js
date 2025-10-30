import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { authService } from "../services/authService";
import tmdbApi from "../services/tmdbApi";
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import ModernMovieCard from "../components/ModernMovieCard";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { fetchWatchlist } = useWatchlist();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching favorites...");
        
        // Get favorites from backend (returns array of { id, movieId, addedAt })
        const favorites = await authService.getFavorites();
        console.log("Favorites from backend:", favorites);

        if (!favorites || favorites.length === 0) {
          console.log("No favorites found");
          setFavoriteMovies([]);
          setLoading(false);
          return;
        }

        console.log(`Fetching details for ${favorites.length} movies...`);
        
        // Fetch movie details from TMDB for each favorite
        const moviePromises = favorites.map(async (favorite) => {
          try {
            const response = await tmdbApi.get(`/movie/${favorite.movieId}`);
            return response.data;
          } catch (err) {
            console.error(`Error fetching movie ${favorite.movieId}:`, err);
            return null;
          }
        });

        const movies = await Promise.all(moviePromises);
        // Filter out any null values (failed fetches)
        const validMovies = movies.filter((movie) => movie !== null);
        console.log(`Successfully loaded ${validMovies.length} movies`);
        setFavoriteMovies(validMovies);

        // Refresh watchlist context to ensure it's in sync (optional, non-blocking)
        try {
          await fetchWatchlist();
        } catch (err) {
          console.warn("Failed to refresh watchlist context:", err);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError(err.message || "Failed to load your favorites. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, authLoading]);

  // Show loading if auth is still loading or favorites are loading
  if (authLoading || loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <BookmarkIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2, #90caf9)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            My Favorites
          </Typography>
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ ml: 7 }}
        >
          {favoriteMovies.length === 0
            ? "You haven't added any favorites yet."
            : `You have ${favoriteMovies.length} favorite movie${
                favoriteMovies.length !== 1 ? "s" : ""
              }.`}
        </Typography>
      </Box>

      {favoriteMovies.length === 0 ? (
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 6, textAlign: "center" }}>
            <BookmarkIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom color="text.secondary">
              No Favorites Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start adding movies to your favorites by clicking the bookmark icon
              on any movie card.
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                component="button"
                onClick={() => navigate("/")}
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: "primary.main",
                  color: "white",
                  border: "none",
                  borderRadius: 2,
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                Browse Movies
              </Box>
            </motion.div>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {favoriteMovies.map((movie, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={movie.id}
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ModernMovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;

