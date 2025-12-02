import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DetailModal from "./DetailModal";
import { useWatchlist } from "../context/WatchlistContext";
import { tokens } from "../theme";

/**
 * ModernMovieCard Component
 *
 * A visually rich, interactive card component for displaying movie/TV show information.
 * Features smooth animations, hover effects, and integrated watchlist functionality.
 *
 * Design Features:
 * - Lift animation on hover with 3D perspective
 * - Image zoom with parallax effect
 * - Sweeping shine effect overlay
 * - Animated rating badge and favorite button
 * - Action buttons that appear on hover
 * - Glass morphism design elements
 * - Responsive layout with dynamic gradients
 *
 * @param {Object} props - Component props
 * @param {Object} props.movie - Movie/TV show data object from TMDB API
 * @param {number} props.movie.id - Unique identifier for the media item
 * @param {string} props.movie.title - Movie title (for movies)
 * @param {string} props.movie.name - Show name (for TV shows)
 * @param {string} props.movie.poster_path - Path to poster image on TMDB CDN
 * @param {number} props.movie.vote_average - TMDB rating (0-10 scale)
 * @param {string} props.movie.media_type - Type of media ('movie' or 'tv')
 * @param {string} props.movie.release_date - Release date for movies
 * @param {string} props.movie.first_air_date - First air date for TV shows
 *
 * @example
 * <ModernMovieCard movie={{
 *   id: 550,
 *   title: "Fight Club",
 *   poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
 *   vote_average: 8.4,
 *   media_type: "movie",
 *   release_date: "1999-10-15"
 * }} />
 */
const ModernMovieCard = ({ movie }) => {
  // State management for hover effects and modal visibility
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Access watchlist context for favorite functionality
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, loading } =
    useWatchlist();

  // Construct poster image URL from TMDB CDN or use placeholder
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image+Available";

  // Check if current movie is in user's watchlist
  const inWatchlist = isInWatchlist(movie.id);

  /**
   * Handle watchlist toggle (add/remove favorite)
   * Prevents event propagation to avoid triggering card click
   * @param {Event} e - Click event
   */
  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  /**
   * Handle info/detail button click
   * Opens modal with detailed movie information
   * @param {Event} e - Click event
   */
  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowDetail(true);
  };

  return (
    <>
      <Box
        component={motion.div}
        whileHover={{
          y: -12,
          transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] },
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setShowDetail(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          borderRadius: tokens.borderRadius.xl,
          overflow: "visible",
          cursor: "pointer",
          height: "100%",
        }}
      >
        {/* Main Card Container with 3D perspective */}
        <Box
          sx={{
            position: "relative",
            borderRadius: tokens.borderRadius.xl,
            overflow: "hidden",
            height: 330,
            backgroundColor: tokens.colors.dark[700],
            boxShadow: tokens.shadows.lg,
            border: `1px solid ${tokens.colors.dark[600]}`,
            transition: "all 0.4s cubic-bezier(0.43, 0.13, 0.23, 0.96)",
            transformStyle: "preserve-3d",
            "&:hover": {
              boxShadow: `0 20px 60px rgba(99, 102, 241, 0.3), 0 0 0 1px ${tokens.colors.brand.primary}`,
              borderColor: tokens.colors.brand.primary,
            },
          }}
        >
          {/* Movie Poster with Parallax */}
          <Box
            component={motion.img}
            src={imageUrl}
            alt={movie.title || movie.name}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              duration: 0.6,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Gradient Overlay - Always visible, changes on hover */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isHovered
                ? `linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)`
                : `linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 50%)`,
              transition: "background 0.3s ease",
              pointerEvents: "none",
            }}
          />

          {/* Top Badges - Always visible */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 0,
              right: 0,
              px: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              zIndex: 2,
            }}
          >
            {/* Rating Badge */}
            {movie.vote_average > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.5,
                    py: 0.8,
                    borderRadius: tokens.borderRadius.full,
                    background: `linear-gradient(135deg, ${tokens.colors.brand.primary}15, ${tokens.colors.brand.primaryDark}25)`,
                    backdropFilter: `blur(${tokens.blur.md})`,
                    border: `1px solid ${tokens.colors.brand.primary}40`,
                  }}
                >
                  <StarIcon
                    sx={{
                      fontSize: 16,
                      color: tokens.colors.accent,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: tokens.colors.light[50],
                      fontWeight: tokens.typography.fontWeight.bold,
                      fontSize: tokens.typography.fontSize.xs,
                    }}
                  >
                    {movie.vote_average.toFixed(1)}
                  </Typography>
                </Box>
              </motion.div>
            )}

            {/* Favorite Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tooltip
                title={inWatchlist ? "Remove from Favorites" : "Add to Favorites"}
                placement="top"
              >
                <IconButton
                  onClick={handleWatchlistClick}
                  size="small"
                  sx={{
                    backgroundColor: inWatchlist
                      ? `${tokens.colors.accent}20`
                      : "rgba(0, 0, 0, 0.6)",
                    backdropFilter: `blur(${tokens.blur.md})`,
                    color: inWatchlist ? tokens.colors.accent : tokens.colors.light[300],
                    width: 36,
                    height: 36,
                    border: `1px solid ${
                      inWatchlist
                        ? `${tokens.colors.accent}60`
                        : "rgba(255, 255, 255, 0.2)"
                    }`,
                    transition: tokens.transitions.all,
                    "&:hover": {
                      backgroundColor: inWatchlist
                        ? `${tokens.colors.accent}30`
                        : "rgba(0, 0, 0, 0.8)",
                      transform: "scale(1.15) rotate(5deg)",
                      color: tokens.colors.accent,
                    },
                  }}
                  disabled={loading}
                >
                  {inWatchlist ? (
                    <BookmarkIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <BookmarkBorderIcon sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>

          {/* Bottom Info - Always visible, expands on hover */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: isHovered ? "24px 16px 20px" : "16px 16px 14px",
              transition: "padding 0.3s ease",
              zIndex: 2,
            }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                color: tokens.colors.light[50],
                fontSize: isHovered
                  ? tokens.typography.fontSize.md
                  : tokens.typography.fontSize.base,
                fontWeight: tokens.typography.fontWeight.bold,
                mb: isHovered ? 1.5 : 0.8,
                lineHeight: 1.3,
                transition: "all 0.3s ease",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {movie.title || movie.name}
            </Typography>

            {/* Metadata */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: isHovered ? 2 : 0,
                opacity: isHovered ? 1 : 0.8,
                transition: "all 0.3s ease",
              }}
            >
              {/* Media Type Chip */}
              {movie.media_type && (
                <Chip
                  label={movie.media_type === "tv" ? "Series" : "Film"}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: tokens.typography.fontSize.xs,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    backgroundColor: `${tokens.colors.brand.secondary}30`,
                    color: tokens.colors.brand.secondaryLight,
                    border: `1px solid ${tokens.colors.brand.secondary}50`,
                    "& .MuiChip-label": {
                      px: 1.5,
                      py: 0,
                    },
                  }}
                />
              )}

              {/* Year */}
              {(movie.release_date || movie.first_air_date) && (
                <Typography
                  variant="caption"
                  sx={{
                    color: tokens.colors.light[400],
                    fontSize: tokens.typography.fontSize.xs,
                    fontWeight: tokens.typography.fontWeight.medium,
                  }}
                >
                  {new Date(movie.release_date || movie.first_air_date).getFullYear()}
                </Typography>
              )}
            </Box>

            {/* Action Buttons - Only on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Tooltip title="View Details" placement="top">
                      <IconButton
                        onClick={handleInfoClick}
                        size="small"
                        sx={{
                          backgroundColor: tokens.colors.brand.primary,
                          color: tokens.colors.light[50],
                          width: 36,
                          height: 36,
                          transition: tokens.transitions.all,
                          "&:hover": {
                            backgroundColor: tokens.colors.brand.primaryDark,
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Quick Preview" placement="top">
                      <IconButton
                        onClick={handleInfoClick}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                          backdropFilter: `blur(${tokens.blur.sm})`,
                          color: tokens.colors.light[50],
                          width: 36,
                          height: 36,
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          transition: tokens.transitions.all,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.25)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <PlayCircleOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Shine effect on hover */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
              transform: isHovered ? "translateX(300%)" : "translateX(0)",
              transition: "transform 0.8s ease",
              pointerEvents: "none",
            }}
          />
        </Box>
      </Box>

      <DetailModal
        open={showDetail}
        onClose={() => setShowDetail(false)}
        mediaId={movie.id}
        mediaType={movie.media_type || "movie"}
      />
    </>
  );
};

export default ModernMovieCard;
