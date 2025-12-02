import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { tokens } from "../theme";
import { getMovieDetails, getMovieRecommendations } from "../services/tmdbApi";
import MovieCard from "../components/MovieCard";

/**
 * Dashboard Component
 *
 * A comprehensive analytics dashboard showing personalized insights and statistics.
 * This component demonstrates advanced data visualization and user behavior analysis.
 *
 * Features:
 * - Real-time statistics (favorites, reviews, watch history)
 * - Personalized movie recommendations based on user's top-rated favorites
 * - Genre preference analysis with visual charts
 * - Viewing patterns and trends
 * - Top rated content from user's library
 *
 * Recommendation Algorithm:
 * - Fetches recommendations from TMDB API based on top 3 highest-rated favorites
 * - Aggregates results from multiple sources
 * - Deduplicates and filters out already-favorited movies
 * - Displays up to 12 personalized recommendations
 *
 * Technical Highlights:
 * - Data aggregation and analysis
 * - Async data fetching with Promise.all
 * - Dynamic chart generation
 * - Responsive grid layout
 * - Framer Motion animations
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { favorites } = useWatchlist();

  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalReviews: 0,
    totalWatchTime: 0,
    genreBreakdown: {},
    topGenres: [],
    averageRating: 0,
    favoritesByMonth: [],
  });

  const [loading, setLoading] = useState(true);
  const [topMovies, setTopMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Check if favorites exists and has items
        if (!favorites || favorites.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch detailed movie data for favorites
        const movieDetailsPromises = favorites.slice(0, 10).map((fav) =>
          getMovieDetails(fav.movieId)
        );
        const moviesData = await Promise.all(movieDetailsPromises);

        // Analyze genre preferences
        const genreMap = {};
        moviesData.forEach((movie) => {
          if (movie.genres) {
            movie.genres.forEach((genre) => {
              genreMap[genre.name] = (genreMap[genre.name] || 0) + 1;
            });
          }
        });

        // Get top genres
        const topGenres = Object.entries(genreMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        // Calculate stats
        const totalRating = moviesData.reduce(
          (sum, movie) => sum + (movie.vote_average || 0),
          0
        );

        setStats({
          totalFavorites: favorites.length,
          totalReviews: 0, // Will be populated from reviews API
          totalWatchTime: moviesData.reduce(
            (sum, movie) => sum + (movie.runtime || 0),
            0
          ),
          genreBreakdown: genreMap,
          topGenres,
          averageRating: moviesData.length > 0 ? totalRating / moviesData.length : 0,
        });

        // Sort movies by rating
        const sortedMovies = moviesData
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 5);
        setTopMovies(sortedMovies);

        // Fetch recommendations based on top-rated favorites
        const topFavorites = moviesData
          .sort((a, b) => b.vote_average - a.vote_average)
          .slice(0, 3);

        const recommendationPromises = topFavorites.map((movie) =>
          getMovieRecommendations(movie.id)
        );
        const recommendationsData = await Promise.all(recommendationPromises);

        // Aggregate and deduplicate recommendations
        const allRecommendations = recommendationsData.flatMap(
          (rec) => rec.results || []
        );
        const uniqueRecommendations = Array.from(
          new Map(allRecommendations.map((movie) => [movie.id, movie])).values()
        );

        // Filter out movies that are already in favorites
        const favoriteIds = favorites.map((fav) => fav.movieId);
        const filteredRecommendations = uniqueRecommendations.filter(
          (movie) => !favoriteIds.includes(movie.id)
        );

        setRecommendations(filteredRecommendations.slice(0, 12));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [favorites]);

  // Stat Card Component
  const StatCard = ({ icon, title, value, subtitle, color, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card
        sx={{
          background: `linear-gradient(135deg, ${color}15, ${color}05)`,
          border: `1px solid ${color}30`,
          borderRadius: tokens.borderRadius.xl,
          height: "100%",
          transition: tokens.transitions.all,
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 24px ${color}30`,
            borderColor: `${color}60`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                background: `linear-gradient(135deg, ${color}, ${color}90)`,
                width: 48,
                height: 48,
                mr: 2,
              }}
            >
              {icon}
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: tokens.typography.fontWeight.bold,
                  color: tokens.colors.light[50],
                  mb: 0.5,
                }}
              >
                {value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: tokens.colors.light[400],
                  fontSize: tokens.typography.fontSize.sm,
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
          {subtitle && (
            <Typography
              variant="caption"
              sx={{
                color: tokens.colors.light[500],
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 16, color }} />
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  // Genre Chart Component
  const GenreChart = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card
        sx={{
          background: "rgba(30, 30, 30, 0.8)",
          backdropFilter: `blur(${tokens.blur.lg})`,
          border: `1px solid ${tokens.colors.dark[600]}`,
          borderRadius: tokens.borderRadius.xl,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: tokens.colors.light[50],
              fontWeight: tokens.typography.fontWeight.bold,
              mb: 3,
            }}
          >
            Genre Preferences
          </Typography>
          <Stack spacing={2}>
            {stats.topGenres.map((genre, index) => {
              const percentage = (genre.count / stats.totalFavorites) * 100;
              const colors = [
                tokens.colors.brand.primary,
                tokens.colors.brand.secondary,
                tokens.colors.accent,
                tokens.colors.brand.primaryLight,
                tokens.colors.brand.secondaryLight,
              ];
              return (
                <Box key={genre.name}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: tokens.colors.light[200],
                        fontWeight: tokens.typography.fontWeight.medium,
                      }}
                    >
                      {genre.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: tokens.colors.light[400],
                        fontSize: tokens.typography.fontSize.sm,
                      }}
                    >
                      {genre.count} movies ({percentage.toFixed(0)}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 8,
                      borderRadius: tokens.borderRadius.full,
                      backgroundColor: `${colors[index]}20`,
                      "& .MuiLinearProgress-bar": {
                        background: `linear-gradient(90deg, ${colors[index]}, ${colors[index]}90)`,
                        borderRadius: tokens.borderRadius.full,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Top Movies Component
  const TopMoviesCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card
        sx={{
          background: "rgba(30, 30, 30, 0.8)",
          backdropFilter: `blur(${tokens.blur.lg})`,
          border: `1px solid ${tokens.colors.dark[600]}`,
          borderRadius: tokens.borderRadius.xl,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: tokens.colors.light[50],
              fontWeight: tokens.typography.fontWeight.bold,
              mb: 3,
            }}
          >
            Top Rated in Your Collection
          </Typography>
          <Stack spacing={2}>
            {topMovies.map((movie, index) => (
              <Paper
                key={movie.id}
                sx={{
                  p: 2,
                  background: `linear-gradient(135deg, ${tokens.colors.dark[700]}, ${tokens.colors.dark[800]})`,
                  border: `1px solid ${tokens.colors.dark[600]}`,
                  borderRadius: tokens.borderRadius.lg,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  transition: tokens.transitions.all,
                  "&:hover": {
                    transform: "translateX(4px)",
                    borderColor: tokens.colors.brand.primary,
                  },
                }}
              >
                <Chip
                  label={`#${index + 1}`}
                  size="small"
                  sx={{
                    background: tokens.gradients.primary,
                    color: tokens.colors.light[50],
                    fontWeight: tokens.typography.fontWeight.bold,
                    minWidth: 40,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: tokens.colors.light[100],
                      fontWeight: tokens.typography.fontWeight.semibold,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {movie.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: tokens.colors.light[500],
                    }}
                  >
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: tokens.borderRadius.full,
                    background: `${tokens.colors.accent}20`,
                  }}
                >
                  <StarIcon
                    sx={{ fontSize: 16, color: tokens.colors.accent }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: tokens.colors.light[100],
                      fontWeight: tokens.typography.fontWeight.bold,
                    }}
                  >
                    {movie.vote_average.toFixed(1)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Empty state when no favorites
  if (!favorites || favorites.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: tokens.colors.dark[800],
          pt: 12,
          pb: 8,
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 4,
                background: `linear-gradient(135deg, ${tokens.colors.dark[700]}, ${tokens.colors.dark[800]})`,
                border: `1px solid ${tokens.colors.dark[600]}`,
                borderRadius: tokens.borderRadius.xl,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: tokens.colors.light[50],
                  fontWeight: tokens.typography.fontWeight.bold,
                  mb: 2,
                  background: tokens.gradients.primary,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome to Your Dashboard! 👋
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: tokens.colors.light[300],
                  mb: 4,
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                Start adding movies to your favorites to see personalized analytics!
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tokens.colors.dark[800],
        }}
      >
        <Typography variant="h6" sx={{ color: tokens.colors.light[300] }}>
          Loading your personalized dashboard...
        </Typography>
      </Box>
    );
  }

  const hoursWatched = Math.floor(stats.totalWatchTime / 60);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.dark[800],
        pt: 12,
        pb: 8,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                color: tokens.colors.light[50],
                fontWeight: tokens.typography.fontWeight.bold,
                mb: 1,
                background: tokens.gradients.primary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome back, {user?.username}! 👋
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: tokens.colors.light[400] }}
            >
              Here's your personalized movie analytics dashboard
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<FavoriteIcon />}
              title="Favorite Movies"
              value={stats.totalFavorites}
              subtitle="Keep discovering!"
              color={tokens.colors.brand.primary}
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<LocalMoviesIcon />}
              title="Hours Watched"
              value={`${hoursWatched}h`}
              subtitle={`${stats.totalWatchTime} minutes total`}
              color={tokens.colors.brand.secondary}
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<StarIcon />}
              title="Avg Rating"
              value={stats.averageRating.toFixed(1)}
              subtitle="From your favorites"
              color={tokens.colors.accent}
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<VisibilityIcon />}
              title="Top Genres"
              value={stats.topGenres.length}
              subtitle="Preferences identified"
              color={tokens.colors.brand.primaryLight}
              delay={0.3}
            />
          </Grid>
        </Grid>

        {/* Charts and Top Movies */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <GenreChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <TopMoviesCard />
          </Grid>
        </Grid>

        {/* Recommended For You */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  color: tokens.colors.light[50],
                  fontWeight: tokens.typography.fontWeight.bold,
                  mb: 1,
                }}
              >
                Recommended For You
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: tokens.colors.light[400],
                  mb: 3,
                }}
              >
                Based on your favorite movies
              </Typography>
              <Grid container spacing={3}>
                {recommendations.map((movie, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <MovieCard movie={movie} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
