import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails } from "../services/tmdbApi";
import {
  Container,
  Grid,
  Typography,
  Box,
  Rating,
  Chip,
  CircularProgress,
} from "@mui/material";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!movie) return <Typography>Movie not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
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
        </Grid>
        <Grid item xs={12} md={8}>
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
              <Chip
                key={genre.id}
                label={genre.name}
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            ))}
          </Box>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography variant="body1" paragraph>
            {movie.overview}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetail;
