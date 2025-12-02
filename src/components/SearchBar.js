import React, { useState, useEffect } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Chip,
  Tooltip,
  Fade,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import TvIcon from "@mui/icons-material/Tv";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { searchMulti } from "../services/tmdbApi";
import { debounce } from "lodash";
import { tokens } from "../theme";

/**
 * SearchBar Component
 *
 * A minimal, pill-shaped search bar with glass morphism design and auto-suggestions.
 * Provides real-time search with debouncing and media type filtering.
 *
 * Features:
 * - Auto-complete suggestions with poster thumbnails
 * - Media type filters (All, Movies, TV)
 * - Debounced search (300ms) to reduce API calls
 * - Glass morphism design with backdrop blur
 * - Click-away listener to close suggestions
 * - Clear button when input has content
 *
 * @param {Object} props - Component props
 * @param {Function} [props.onSearch] - Callback when search is submitted (query, mediaType)
 * @param {Function} [props.onBack] - Callback when search is cleared
 *
 * @example
 * <SearchBar
 *   onSearch={(query, mediaType) => console.log(query, mediaType)}
 *   onBack={() => console.log('Search cleared')}
 * />
 */
const SearchBar = ({ onSearch, onBack } = {}) => {
  // Local state for search input and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /**
   * Fetch search suggestions from TMDB API with debouncing
   * Debounced to 300ms to prevent excessive API calls while typing
   * Only fetches if query is 2+ characters
   * Limits results to top 5 suggestions
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = debounce(async (query) => {
    // Minimum query length to trigger search
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const data = await searchMulti(query);
      // Limit to top 5 results for cleaner UI
      setSuggestions(data.results.slice(0, 5));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 300); // 300ms debounce delay

  useEffect(() => {
    if (searchQuery) {
      fetchSuggestions(searchQuery);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery, mediaType);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const title = suggestion.title || suggestion.name;
    setSearchQuery(title);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(title, suggestion.media_type || "all");
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (onBack) {
      onBack();
    }
  };

  const mediaTypes = [
    { value: "all", label: "All", icon: <AllInclusiveIcon sx={{ fontSize: 16 }} /> },
    { value: "movie", label: "Movies", icon: <MovieFilterIcon sx={{ fontSize: 16 }} /> },
    { value: "tv", label: "TV", icon: <TvIcon sx={{ fontSize: 16 }} /> },
  ];

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "700px",
          mx: "auto",
        }}
      >
        {/* Main Search Container - Minimal Glass Design */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1.2,
            borderRadius: tokens.borderRadius.full,
            background: "rgba(30, 30, 30, 0.6)",
            backdropFilter: `blur(${tokens.blur.md})`,
            WebkitBackdropFilter: `blur(${tokens.blur.md})`,
            border: `1px solid ${tokens.colors.dark[600]}`,
            transition: tokens.transitions.all,
            "&:hover": {
              background: "rgba(35, 35, 35, 0.7)",
              borderColor: tokens.colors.dark[500],
            },
            "&:focus-within": {
              background: "rgba(40, 40, 40, 0.8)",
              borderColor: tokens.colors.brand.primary,
              boxShadow: `0 0 0 3px ${tokens.colors.brand.primary}20`,
            },
          }}
        >
          {/* Search Icon */}
          <SearchIcon
            sx={{
              color: tokens.colors.light[500],
              fontSize: 20,
            }}
          />

          {/* Input Field - Clean & Minimal */}
          <InputBase
            placeholder="Search movies and TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            sx={{
              flex: 1,
              color: tokens.colors.light[100],
              fontSize: tokens.typography.fontSize.sm,
              fontWeight: tokens.typography.fontWeight.medium,
              "& ::placeholder": {
                color: tokens.colors.light[600],
                opacity: 1,
              },
            }}
          />

          {/* Media Type Filter Chips - Minimal Design */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {mediaTypes.map((type) => (
              <Tooltip key={type.value} title={type.label} placement="bottom">
                <Chip
                  icon={type.icon}
                  label={type.label}
                  size="small"
                  onClick={() => setMediaType(type.value)}
                  sx={{
                    height: 28,
                    fontSize: tokens.typography.fontSize.xs,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    backgroundColor:
                      mediaType === type.value
                        ? tokens.colors.brand.primary
                        : "rgba(255, 255, 255, 0.08)",
                    color:
                      mediaType === type.value
                        ? tokens.colors.light[50]
                        : tokens.colors.light[400],
                    border:
                      mediaType === type.value
                        ? `1px solid ${tokens.colors.brand.primary}`
                        : "1px solid rgba(255, 255, 255, 0.1)",
                    transition: tokens.transitions.all,
                    cursor: "pointer",
                    "& .MuiChip-icon": {
                      color: "inherit",
                      ml: 0.5,
                    },
                    "& .MuiChip-label": {
                      px: 1,
                    },
                    "&:hover": {
                      backgroundColor:
                        mediaType === type.value
                          ? tokens.colors.brand.primaryDark
                          : "rgba(255, 255, 255, 0.12)",
                      transform: "translateY(-1px)",
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Box>

          {/* Clear Button */}
          {searchQuery && (
            <IconButton
              onClick={handleClear}
              size="small"
              sx={{
                color: tokens.colors.light[500],
                width: 28,
                height: 28,
                transition: tokens.transitions.all,
                "&:hover": {
                  color: tokens.colors.light[300],
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>

        {/* Suggestions Dropdown - Minimal Glass Design */}
        {showSuggestions && suggestions.length > 0 && (
          <Fade in={showSuggestions}>
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                background: "rgba(30, 30, 30, 0.95)",
                backdropFilter: `blur(${tokens.blur.lg})`,
                WebkitBackdropFilter: `blur(${tokens.blur.lg})`,
                borderRadius: tokens.borderRadius.xl,
                border: `1px solid ${tokens.colors.dark[600]}`,
                boxShadow: tokens.shadows.xl,
                overflow: "hidden",
                zIndex: 1500,
              }}
            >
              {suggestions.map((suggestion, index) => {
                const title = suggestion.title || suggestion.name;
                const year = suggestion.release_date
                  ? new Date(suggestion.release_date).getFullYear()
                  : suggestion.first_air_date
                  ? new Date(suggestion.first_air_date).getFullYear()
                  : "";
                const type = suggestion.media_type === "tv" ? "Series" : "Film";

                return (
                  <Box
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: 3,
                      py: 2,
                      cursor: "pointer",
                      transition: tokens.transitions.all,
                      borderBottom:
                        index < suggestions.length - 1
                          ? `1px solid ${tokens.colors.dark[700]}`
                          : "none",
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.15)",
                      },
                    }}
                  >
                    {/* Poster Thumbnail */}
                    {suggestion.poster_path ? (
                      <Box
                        component="img"
                        src={`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`}
                        alt={title}
                        sx={{
                          width: 32,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: tokens.borderRadius.sm,
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 32,
                          height: 48,
                          borderRadius: tokens.borderRadius.sm,
                          backgroundColor: tokens.colors.dark[700],
                          flexShrink: 0,
                        }}
                      />
                    )}

                    {/* Title & Metadata */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          color: tokens.colors.light[100],
                          fontSize: tokens.typography.fontSize.sm,
                          fontWeight: tokens.typography.fontWeight.medium,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mb: 0.5,
                        }}
                      >
                        {title}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Chip
                          label={type}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: tokens.typography.fontSize.xs,
                            fontWeight: tokens.typography.fontWeight.semibold,
                            backgroundColor: `${tokens.colors.brand.secondary}20`,
                            color: tokens.colors.brand.secondaryLight,
                            border: `1px solid ${tokens.colors.brand.secondary}40`,
                            "& .MuiChip-label": {
                              px: 1,
                            },
                          }}
                        />
                        {year && (
                          <Box
                            sx={{
                              color: tokens.colors.light[500],
                              fontSize: tokens.typography.fontSize.xs,
                            }}
                          >
                            {year}
                          </Box>
                        )}
                        {suggestion.vote_average > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.3,
                              color: tokens.colors.accent,
                              fontSize: tokens.typography.fontSize.xs,
                              fontWeight: tokens.typography.fontWeight.semibold,
                            }}
                          >
                            ★ {suggestion.vote_average.toFixed(1)}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Fade>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;
