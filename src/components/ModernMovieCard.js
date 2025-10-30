import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DetailModal from "./DetailModal";
import { useWatchlist } from "../context/WatchlistContext";

const ModernMovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, loading } =
    useWatchlist();

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image+Available";

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  return (
    <>
      <Box
        component={motion.div}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.2 },
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={() => setShowDetail(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          cursor: "pointer",
          height: 400,
          backgroundColor: "background.paper",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt={movie.title || movie.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />

        {/* Watchlist Button */}
        <Tooltip
          title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <span style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
            <IconButton
              onClick={handleWatchlistClick}
              sx={{
                background: "rgba(0,0,0,0.6)",
                color: inWatchlist ? "#ffd600" : "white",
                "&:hover": {
                  background: "rgba(0,0,0,0.8)",
                },
              }}
              disabled={loading}
            >
              {inWatchlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </span>
        </Tooltip>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              mb: 1,
              fontWeight: 600,
            }}
          >
            {movie.title || movie.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.5}
              readOnly
              size="small"
              sx={{ color: "primary.light" }}
            />
            <Typography variant="body2" sx={{ color: "white", ml: 1 }}>
              ({movie.vote_average.toFixed(1)})
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {movie.media_type && (
              <Chip
                label={movie.media_type.toUpperCase()}
                size="small"
                sx={{ backgroundColor: "primary.main", color: "white" }}
              />
            )}
            {movie.release_date && (
              <Chip
                label={movie.release_date.split("-")[0]}
                size="small"
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
              />
            )}
          </Box>
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
