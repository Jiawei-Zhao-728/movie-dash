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

export const searchMulti = async (query, page = 1, additionalParams = {}) => {
  try {
    const response = await tmdbApi.get("/search/multi", {
      params: {
        query,
        page,
        include_adult: false,
        ...additionalParams,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1, additionalParams = {}) => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query,
        page,
        include_adult: false,
        ...additionalParams,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const searchTVShows = async (query, page = 1, additionalParams = {}) => {
  try {
    const response = await tmdbApi.get("/search/tv", {
      params: {
        query,
        page,
        include_adult: false,
        ...additionalParams,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching TV shows:", error);
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
    const [details, credits, videos] = await Promise.all([
      tmdbApi.get(`/movie/${movieId}`),
      tmdbApi.get(`/movie/${movieId}/credits`),
      tmdbApi.get(`/movie/${movieId}/videos`),
    ]);

    return {
      ...details.data,
      credits: credits.data,
      videos: videos.data.results,
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const getTVShowDetails = async (tvId) => {
  try {
    const [details, credits, videos] = await Promise.all([
      tmdbApi.get(`/tv/${tvId}`),
      tmdbApi.get(`/tv/${tvId}/credits`),
      tmdbApi.get(`/tv/${tvId}/videos`),
    ]);

    return {
      ...details.data,
      credits: credits.data,
      videos: videos.data.results,
    };
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await fetch(
      `${tmdbApi.defaults.baseURL}/genre/movie/list?api_key=${tmdbApi.defaults.params.api_key}&language=en-US`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const discoverMovies = async (
  genres = [],
  startDate = "",
  endDate = ""
) => {
  try {
    let url = `${tmdbApi.defaults.baseURL}/discover/movie?api_key=${tmdbApi.defaults.params.api_key}&language=en-US&sort_by=popularity.desc`;

    if (genres.length > 0) {
      url += `&with_genres=${genres.join(",")}`;
    }

    if (startDate) {
      url += `&primary_release_date.gte=${startDate}`;
    }

    if (endDate) {
      url += `&primary_release_date.lte=${endDate}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export default tmdbApi;
