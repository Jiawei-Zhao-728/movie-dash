import React, { useEffect, useState } from "react";
import { getTrendingMovies } from "../services/tmdbApi";
import { Container, Grid, Typography } from "@mui/material";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Movie Dash
      </Typography>
      <Typography variant="h5" gutterBottom>
        Trending Movies
      </Typography>
      <Grid container spacing={3}>
        {trendingMovies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
