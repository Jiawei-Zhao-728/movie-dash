import React, { useState, useEffect } from "react";
import { discoverMovies } from "../services/tmdbApi";
import MovieCard from "./MovieCard";
import MovieFilters from "./MovieFilters";
import { Grid, Container, Typography, CircularProgress } from "@mui/material";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genres: [],
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const movieData = await discoverMovies(
          filters.genres,
          filters.startDate,
          filters.endDate
        );
        setMovies(movieData.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Discover Movies
      </Typography>

      <MovieFilters onFilterChange={handleFilterChange} />

      {loading ? (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MovieList;
