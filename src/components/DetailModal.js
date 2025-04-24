import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Rating,
  Tabs,
  Tab,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { getMovieDetails, getTVShowDetails } from "../services/tmdbApi";

const DetailModal = ({ open, onClose, mediaId, mediaType }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!mediaId) return;
      setLoading(true);
      try {
        const data =
          mediaType === "movie"
            ? await getMovieDetails(mediaId)
            : await getTVShowDetails(mediaId);
        setDetails(data);

        // Set first trailer as default if available
        const trailer =
          data.videos.find((v) => v.type === "Trailer") || data.videos[0];
        setSelectedTrailer(trailer);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDetails();
    }
  }, [mediaId, mediaType, open]);

  if (!open || loading || !details) return null;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderOverview = () => (
    <Box>
      <Typography variant="body1" paragraph>
        {details.overview}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            Release Date
          </Typography>
          <Typography>
            {mediaType === "movie"
              ? details.release_date
              : details.first_air_date}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            {mediaType === "movie" ? "Runtime" : "Episodes"}
          </Typography>
          <Typography>
            {mediaType === "movie"
              ? `${details.runtime} minutes`
              : `${details.number_of_episodes} episodes (${details.number_of_seasons} seasons)`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            Genres
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {details.genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} variant="outlined" />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const renderCast = () => (
    <List>
      {details.credits.cast.slice(0, 10).map((person) => (
        <ListItem key={person.id}>
          <ListItemAvatar>
            <Avatar
              src={
                person.profile_path
                  ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                  : "/placeholder-avatar.png"
              }
            />
          </ListItemAvatar>
          <ListItemText primary={person.name} secondary={person.character} />
        </ListItem>
      ))}
    </List>
  );

  const renderVideos = () => (
    <Box>
      {selectedTrailer && (
        <Box sx={{ position: "relative", paddingTop: "56.25%", mb: 2 }}>
          <iframe
            src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
            title={selectedTrailer.name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allowFullScreen
          />
        </Box>
      )}
      <Grid container spacing={2}>
        {details.videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Button
              variant={
                selectedTrailer?.id === video.id ? "contained" : "outlined"
              }
              startIcon={<PlayArrowIcon />}
              onClick={() => setSelectedTrailer(video)}
              fullWidth
            >
              {video.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <Box
        sx={{
          position: "relative",
          height: "300px",
          backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
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
              "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
          },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
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
            p: 3,
            color: "white",
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            {mediaType === "movie" ? details.title : details.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Rating value={details.vote_average / 2} precision={0.5} readOnly />
            <Typography>
              {details.vote_average.toFixed(1)} ({details.vote_count} votes)
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogContent>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Cast" />
          <Tab label="Videos" />
        </Tabs>

        {activeTab === 0 && renderOverview()}
        {activeTab === 1 && renderCast()}
        {activeTab === 2 && renderVideos()}
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
