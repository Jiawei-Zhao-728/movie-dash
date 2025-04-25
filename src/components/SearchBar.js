import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Popper,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  Chip,
  CircularProgress,
  Button,
  OutlinedInput,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { searchMulti, getGenres } from "../services/tmdbApi";
import { debounce } from "lodash";

const SearchBar = ({ onSearch, onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState("movie");
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSuggestions = debounce(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchMulti(query);
      setSuggestions(data.results.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenres();
        setGenres(genreData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, mediaType, {
        genres: selectedGenres.map((genre) => genre.id),
        startDate,
        endDate,
      });
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title || suggestion.name);
    setSuggestions([]);
    onSearch(suggestion.title || suggestion.name, suggestion.media_type);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        mx: "auto",
      }}
    >
      <Paper
        component={motion.form}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        onSubmit={handleSearch}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 8,
          backgroundColor: "background.paper",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={onBack}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for movies or TV shows..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setAnchorEl(e.currentTarget);
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 8,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.01)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <IconButton
                      onClick={() => setShowFilters(!showFilters)}
                      color={showFilters ? "primary" : "default"}
                      sx={{
                        transition: "transform 0.3s ease",
                        transform: showFilters ? "rotate(180deg)" : "rotate(0)",
                      }}
                    >
                      <FilterListIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              borderRadius: "28px",
              padding: "8px 32px",
              height: 56,
              textTransform: "none",
              fontSize: "1rem",
              backgroundColor: "primary.main",
              color: "white",
              boxShadow: "0 3px 5px 2px rgba(25, 118, 210, 0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 8px 2px rgba(25, 118, 210, 0.2)",
              },
            }}
          >
            Search
          </Button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ width: "100%" }}
              >
                <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value)}
                      label="Type"
                      sx={{ borderRadius: 4 }}
                    >
                      <MenuItem value="movie">Movies</MenuItem>
                      <MenuItem value="tv">TV Shows</MenuItem>
                      <MenuItem value="all">All</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Genres</InputLabel>
                    <Select
                      multiple
                      value={selectedGenres}
                      onChange={(e) => setSelectedGenres(e.target.value)}
                      input={<OutlinedInput label="Genres" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((genre) => (
                            <Chip
                              key={genre.id}
                              label={genre.name}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 200 }}
                  />

                  <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 200 }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Paper>

      <Popper
        open={Boolean(suggestions.length)}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: anchorEl?.clientWidth, zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setSuggestions([])}>
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: "background.paper",
            }}
          >
            <List sx={{ p: 0 }}>
              {suggestions.map((suggestion) => (
                <ListItem
                  key={suggestion.id}
                  button
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    transition: "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={suggestion.title || suggestion.name}
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        {suggestion.media_type === "movie" ? (
                          <MovieIcon fontSize="small" />
                        ) : (
                          <TvIcon fontSize="small" />
                        )}
                        <Chip
                          label={suggestion.media_type.toUpperCase()}
                          size="small"
                          variant="outlined"
                        />
                        {suggestion.release_date && (
                          <Chip
                            label={suggestion.release_date.split("-")[0]}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default SearchBar;
