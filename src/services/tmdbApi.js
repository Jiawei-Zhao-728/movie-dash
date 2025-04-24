import axios from "axios";

const tmdbApi = axios.create({
  baseURL:
    process.env.REACT_APP_TMDB_API_BASE_URL || "https://api.themoviedb.org/3",
  params: {
    api_key: process.env.REACT_APP_TMDB_API_KEY,
  },
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_READ_ACCESS_TOKEN}`,
  },
});

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await tmdbApi.get("/trending/movie/week");
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export default tmdbApi;
