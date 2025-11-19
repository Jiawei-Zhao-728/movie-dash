import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getMovieDetails } from "../services/tmdbApi";
import {
  Container,
  Grid,
  Typography,
  Box,
  Rating,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    
    setReviewsLoading(true);
    try {
      const reviewsData = await authService.getMovieReviews(parseInt(id));
      setReviews(reviewsData);
      
      // Find user's review if logged in
      if (user) {
        const myReview = reviewsData.find((r) => r.userId === user.id);
        setUserReview(myReview || null);
      } else {
        setUserReview(null);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to fetch movie details");
        setLoading(false);
      }
    };

    fetchMovieDetails();
    fetchReviews();
  }, [id, fetchReviews]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!movie) return <Typography>Movie not found</Typography>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </motion.div>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Box
                component="img"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Typography variant="h3" component="h1" gutterBottom>
                {movie.title}
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Rating
                  value={movie.vote_average / 2}
                  precision={0.5}
                  readOnly
                  size="large"
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  ({movie.vote_average.toFixed(1)})
                </Typography>
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {movie.release_date?.split("-")[0]} • {movie.runtime} min
              </Typography>
              <Box mb={2}>
                {movie.genres?.map((genre) => (
                  <motion.div
                    key={genre.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5 + movie.genres.indexOf(genre) * 0.1,
                    }}
                  >
                    <Chip
                      label={genre.name}
                      sx={{ mr: 1, mb: 1 }}
                      variant="outlined"
                    />
                  </motion.div>
                ))}
              </Box>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.overview}
              </Typography>
            </motion.div>
          </Grid>
        </Grid>

        {/* Reviews Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Reviews
            </Typography>
            
            {/* Review Form */}
            <ReviewForm
              movieId={parseInt(id)}
              existingReview={userReview}
              onReviewSubmitted={fetchReviews}
            />

            {/* Review List */}
            {reviewsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <ReviewList reviews={reviews} onReviewDeleted={fetchReviews} />
            )}
          </Box>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default MovieDetail;
