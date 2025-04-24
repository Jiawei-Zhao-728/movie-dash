import React, { useState, useEffect } from "react";
import { getGenres } from "../services/tmdbApi";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  OutlinedInput,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MovieFilters = ({ onFilterChange }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setSelectedGenres(value);
    updateFilters(value, startDate, endDate);
  };

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    setStartDate(value);
    updateFilters(selectedGenres, value, endDate);
  };

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    setEndDate(value);
    updateFilters(selectedGenres, startDate, value);
  };

  const updateFilters = (genres, start, end) => {
    onFilterChange({
      genres: genres.map((genre) => genre.id),
      startDate: start,
      endDate: end,
    });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="genre-label">Genres</InputLabel>
        <Select
          labelId="genre-label"
          id="genre-select"
          multiple
          value={selectedGenres}
          onChange={handleGenreChange}
          input={<OutlinedInput label="Genres" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((genre) => (
                <Chip key={genre.id} label={genre.name} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
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
        onChange={handleStartDateChange}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

export default MovieFilters;
