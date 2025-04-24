import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Box,
  CardActionArea,
} from "@mui/material";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image+Available";

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardActionArea onClick={handleClick}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <CardMedia
              component="img"
              height="350"
              image={imageUrl}
              alt={movie.title}
              sx={{ objectFit: "cover" }}
            />
          </motion.div>
          <CardContent sx={{ flexGrow: 1 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {movie.title}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Rating
                  value={movie.vote_average / 2}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  ({movie.vote_average.toFixed(1)})
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {movie.release_date?.split("-")[0] || "Release date unknown"}
              </Typography>
            </motion.div>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default MovieCard;
