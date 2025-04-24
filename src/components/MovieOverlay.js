import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MovieOverlay = ({ movie, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Paper
            sx={{
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              position: "relative",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: "400px",
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
                },
              }}
            >
              <IconButton
                onClick={onClose}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 3,
                  color: "white",
                }}
              >
                <Typography variant="h4" gutterBottom>
                  {movie.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                <Typography variant="h6" gutterBottom>
                  {movie.release_date?.split("-")[0]} • {movie.runtime} min
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
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
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <IconButton
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieOverlay;
