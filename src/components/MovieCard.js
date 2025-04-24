import React from "react";
import { useNavigate } from "react-router-dom";
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
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <CardActionArea onClick={handleClick}>
        <CardMedia
          component="img"
          height="350"
          image={imageUrl}
          alt={movie.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
