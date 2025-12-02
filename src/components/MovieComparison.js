import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Grid,
  Typography,
  Card,
  CardMedia,
  Chip,
  Stack,
  LinearProgress,
  Divider,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { motion, AnimatePresence } from "framer-motion";
import { searchMulti, getMovieDetails } from "../services/tmdbApi";
import { debounce } from "lodash";
import { tokens } from "../theme";

/**
 * MovieComparison Component
 *
 * Advanced feature that allows side-by-side comparison of two movies.
 * This demonstrates complex state management, async data handling, and creative UX.
 *
 * Resume Highlights:
 * - Complex async data fetching and coordination
 * - Advanced UI with dual search and comparison
 * - Visual data comparison with charts
 * - Debounced search for performance
 * - Creative problem-solving (unique feature)
 *
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onClose - Close handler
 */
const MovieComparison = ({ open, onClose }) => {
  const [movie1, setMovie1] = useState(null);
  const [movie2, setMovie2] = useState(null);
  const [movie1Details, setMovie1Details] = useState(null);
  const [movie2Details, setMovie2Details] = useState(null);
  const [searchOptions1, setSearchOptions1] = useState([]);
  const [searchOptions2, setSearchOptions2] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced search for movie 1
  const handleSearch1 = debounce(async (query) => {
    if (!query || query.length < 2) {
      setSearchOptions1([]);
      return;
    }
    try {
      const data = await searchMulti(query);
      setSearchOptions1(
        data.results
          .filter((item) => item.media_type === "movie")
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  }, 300);

  // Debounced search for movie 2
  const handleSearch2 = debounce(async (query) => {
    if (!query || query.length < 2) {
      setSearchOptions2([]);
      return;
    }
    try {
      const data = await searchMulti(query);
      setSearchOptions2(
        data.results
          .filter((item) => item.media_type === "movie")
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  }, 300);

  // Fetch detailed movie data
  const fetchMovieDetails = async (movieId, setDetails) => {
    try {
      setLoading(true);
      const details = await getMovieDetails(movieId);
      setDetails(details);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setLoading(false);
    }
  };

  // Movie Card Component
  const MovieCard = ({ movie, details }) => {
    if (!movie || !details) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            border: `2px dashed ${tokens.colors.dark[600]}`,
            borderRadius: tokens.borderRadius.xl,
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: tokens.colors.light[500], textAlign: "center" }}
          >
            Search and select a movie to compare
          </Typography>
        </Box>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            background: `linear-gradient(135deg, ${tokens.colors.dark[700]}, ${tokens.colors.dark[800]})`,
            border: `1px solid ${tokens.colors.dark[600]}`,
            borderRadius: tokens.borderRadius.xl,
            overflow: "hidden",
          }}
        >
          {/* Movie Poster */}
          <CardMedia
            component="img"
            image={
              details.poster_path
                ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Poster"
            }
            alt={details.title}
            sx={{ height: 300, objectFit: "cover" }}
          />

          {/* Movie Info */}
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: tokens.colors.light[50],
                fontWeight: tokens.typography.fontWeight.bold,
                mb: 1,
              }}
            >
              {details.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: tokens.colors.light[500], display: "block", mb: 2 }}
            >
              {details.release_date?.split("-")[0]}
            </Typography>

            {/* Rating */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                p: 1.5,
                background: `${tokens.colors.accent}15`,
                borderRadius: tokens.borderRadius.lg,
              }}
            >
              <StarIcon sx={{ color: tokens.colors.accent }} />
              <Typography
                variant="h5"
                sx={{
                  color: tokens.colors.light[50],
                  fontWeight: tokens.typography.fontWeight.bold,
                }}
              >
                {details.vote_average.toFixed(1)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: tokens.colors.light[400] }}
              >
                / 10
              </Typography>
            </Box>

            {/* Genres */}
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
              {details.genres?.slice(0, 3).map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  sx={{
                    backgroundColor: `${tokens.colors.brand.primary}20`,
                    color: tokens.colors.brand.primaryLight,
                    border: `1px solid ${tokens.colors.brand.primary}40`,
                  }}
                />
              ))}
            </Stack>

            {/* Additional Stats */}
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 18, color: tokens.colors.light[500] }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: tokens.colors.light[300] }}
                >
                  {details.runtime} minutes
                </Typography>
              </Box>

              {details.budget > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoneyIcon
                    sx={{ fontSize: 18, color: tokens.colors.light[500] }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: tokens.colors.light[300] }}
                  >
                    ${(details.budget / 1000000).toFixed(0)}M budget
                  </Typography>
                </Box>
              )}

              {details.revenue > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AttachMoneyIcon
                    sx={{ fontSize: 18, color: tokens.colors.light[500] }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: tokens.colors.light[300] }}
                  >
                    ${(details.revenue / 1000000).toFixed(0)}M revenue
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Card>
      </motion.div>
    );
  };

  // Comparison Stats Component
  const ComparisonStats = () => {
    if (!movie1Details || !movie2Details) return null;

    const stats = [
      {
        label: "Rating",
        value1: movie1Details.vote_average,
        value2: movie2Details.vote_average,
        max: 10,
        format: (v) => v.toFixed(1),
      },
      {
        label: "Popularity",
        value1: movie1Details.popularity,
        value2: movie2Details.popularity,
        max: Math.max(movie1Details.popularity, movie2Details.popularity),
        format: (v) => v.toFixed(0),
      },
      {
        label: "Runtime (min)",
        value1: movie1Details.runtime,
        value2: movie2Details.runtime,
        max: Math.max(movie1Details.runtime, movie2Details.runtime),
        format: (v) => v,
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card
          sx={{
            background: `linear-gradient(135deg, ${tokens.colors.dark[700]}, ${tokens.colors.dark[800]})`,
            border: `1px solid ${tokens.colors.dark[600]}`,
            borderRadius: tokens.borderRadius.xl,
            p: 3,
            mt: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: tokens.colors.light[50],
              fontWeight: tokens.typography.fontWeight.bold,
              mb: 3,
              textAlign: "center",
            }}
          >
            Head-to-Head Comparison
          </Typography>

          <Stack spacing={3}>
            {stats.map((stat) => (
              <Box key={stat.label}>
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.light[300],
                    mb: 1,
                    textAlign: "center",
                    fontWeight: tokens.typography.fontWeight.medium,
                  }}
                >
                  {stat.label}
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5}>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            stat.value1 > stat.value2
                              ? tokens.colors.brand.secondary
                              : tokens.colors.light[400],
                          fontWeight: tokens.typography.fontWeight.bold,
                        }}
                      >
                        {stat.format(stat.value1)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(stat.value1 / stat.max) * 100}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: tokens.borderRadius.full,
                          transform: "scaleX(-1)",
                          backgroundColor: `${tokens.colors.brand.primary}20`,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: tokens.colors.brand.primary,
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={2} sx={{ textAlign: "center" }}>
                    <CompareArrowsIcon
                      sx={{ color: tokens.colors.light[600] }}
                    />
                  </Grid>

                  <Grid item xs={5}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color:
                            stat.value2 > stat.value1
                              ? tokens.colors.brand.secondary
                              : tokens.colors.light[400],
                          fontWeight: tokens.typography.fontWeight.bold,
                        }}
                      >
                        {stat.format(stat.value2)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(stat.value2 / stat.max) * 100}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: tokens.borderRadius.full,
                          backgroundColor: `${tokens.colors.brand.primary}20`,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: tokens.colors.brand.primary,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Stack>
        </Card>
      </motion.div>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          background: `linear-gradient(135deg, ${tokens.colors.dark[800]}, ${tokens.colors.dark[900]})`,
          backgroundImage: "none",
          borderRadius: tokens.borderRadius.xl,
          border: `1px solid ${tokens.colors.dark[600]}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: tokens.typography.fontWeight.bold,
            background: tokens.gradients.primary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Compare Movies
        </Typography>
        <IconButton onClick={onClose} sx={{ color: tokens.colors.light[400] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Search Fields */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={searchOptions1}
              getOptionLabel={(option) =>
                `${option.title} (${option.release_date?.split("-")[0] || "N/A"})`
              }
              onInputChange={(event, value) => handleSearch1(value)}
              onChange={(event, value) => {
                setMovie1(value);
                if (value) fetchMovieDetails(value.id, setMovie1Details);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Movie 1"
                  placeholder="Type to search..."
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: tokens.colors.light[100],
                      "& fieldset": {
                        borderColor: tokens.colors.dark[600],
                      },
                      "&:hover fieldset": {
                        borderColor: tokens.colors.brand.primary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: tokens.colors.light[500],
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={searchOptions2}
              getOptionLabel={(option) =>
                `${option.title} (${option.release_date?.split("-")[0] || "N/A"})`
              }
              onInputChange={(event, value) => handleSearch2(value)}
              onChange={(event, value) => {
                setMovie2(value);
                if (value) fetchMovieDetails(value.id, setMovie2Details);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Movie 2"
                  placeholder="Type to search..."
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: tokens.colors.light[100],
                      "& fieldset": {
                        borderColor: tokens.colors.dark[600],
                      },
                      "&:hover fieldset": {
                        borderColor: tokens.colors.brand.primary,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: tokens.colors.light[500],
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        {/* Movie Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MovieCard movie={movie1} details={movie1Details} />
          </Grid>
          <Grid item xs={12} md={6}>
            <MovieCard movie={movie2} details={movie2Details} />
          </Grid>
        </Grid>

        {/* Comparison Stats */}
        <ComparisonStats />
      </DialogContent>
    </Dialog>
  );
};

export default MovieComparison;
