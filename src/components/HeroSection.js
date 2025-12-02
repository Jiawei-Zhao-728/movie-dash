import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import { tokens, truncate } from "../theme";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-rotate hero every 8 seconds (slower for more minimal feel)
  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 8000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currentIndex];
  const backdropUrl = currentMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : null;

  const handleMoreInfo = () => {
    navigate(`/movie/${currentMovie.id}`);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "60vh", md: "75vh" },
        overflow: "hidden",
        mb: 8,
      }}
    >
      {/* Background Image with Subtle Effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          {backdropUrl && (
            <Box
              component="img"
              src={backdropUrl}
              alt={currentMovie.title || currentMovie.name}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                filter: "brightness(0.4) contrast(1.1)",
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Minimal Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(to bottom, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.95) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Content - Centered & Minimal */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          pt: { xs: 12, md: 8 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: "650px" } }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Minimal Metadata Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 3,
                  px: 3,
                  py: 1.5,
                  borderRadius: tokens.borderRadius.full,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: `blur(${tokens.blur.md})`,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {currentMovie.vote_average > 0 && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <StarIcon
                      sx={{
                        fontSize: "1.1rem",
                        color: tokens.colors.accent,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: tokens.colors.light[50],
                        fontWeight: tokens.typography.fontWeight.semibold,
                        fontSize: tokens.typography.fontSize.sm,
                      }}
                    >
                      {currentMovie.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                )}

                {(currentMovie.release_date || currentMovie.first_air_date) && (
                  <>
                    <Box
                      sx={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: tokens.colors.light[500],
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: tokens.colors.light[300],
                        fontSize: tokens.typography.fontSize.sm,
                        fontWeight: tokens.typography.fontWeight.medium,
                      }}
                    >
                      {new Date(
                        currentMovie.release_date || currentMovie.first_air_date
                      ).getFullYear()}
                    </Typography>
                  </>
                )}

                <Box
                  sx={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    backgroundColor: tokens.colors.light[500],
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.colors.light[300],
                    fontSize: tokens.typography.fontSize.xs,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {currentMovie.media_type === "tv" ? "Series" : "Film"}
                </Typography>
              </Box>

              {/* Title - Clean Typography */}
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5rem" },
                  fontWeight: 700,
                  mb: 2.5,
                  lineHeight: 1.1,
                  color: tokens.colors.light[50],
                  letterSpacing: "-0.02em",
                }}
              >
                {currentMovie.title || currentMovie.name}
              </Typography>

              {/* Overview - Minimal */}
              <Typography
                variant="body1"
                sx={{
                  ...truncate(2),
                  fontSize: tokens.typography.fontSize.md,
                  color: tokens.colors.light[300],
                  mb: 5,
                  lineHeight: 1.7,
                  maxWidth: "580px",
                }}
              >
                {currentMovie.overview}
              </Typography>

              {/* Single CTA - Minimal Design */}
              <Button
                variant="contained"
                size="large"
                startIcon={<InfoOutlinedIcon />}
                onClick={handleMoreInfo}
                sx={{
                  background: tokens.gradients.primary,
                  color: tokens.colors.light[50],
                  fontWeight: tokens.typography.fontWeight.semibold,
                  fontSize: tokens.typography.fontSize.base,
                  px: 5,
                  py: 1.8,
                  borderRadius: tokens.borderRadius.full,
                  textTransform: "none",
                  boxShadow: `0 4px 20px rgba(99, 102, 241, 0.25)`,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: tokens.transitions.all,
                  "&:hover": {
                    background: tokens.gradients.primaryReverse,
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 30px rgba(99, 102, 241, 0.35)`,
                  },
                }}
              >
                View Details
              </Button>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>

      {/* Minimal Pagination Indicators */}
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          display: "flex",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {movies.slice(0, 5).map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: currentIndex === index ? 24 : 6,
              height: 6,
              borderRadius: tokens.borderRadius.full,
              backgroundColor:
                currentIndex === index
                  ? tokens.colors.brand.primary
                  : "rgba(255, 255, 255, 0.3)",
              cursor: "pointer",
              transition: tokens.transitions.all,
              "&:hover": {
                backgroundColor:
                  currentIndex === index
                    ? tokens.colors.brand.primary
                    : "rgba(255, 255, 255, 0.6)",
              },
            }}
          />
        ))}
      </Box>

      {/* Subtle Bottom Fade */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "80px",
          background: `linear-gradient(to bottom, transparent 0%, ${tokens.colors.dark[800]} 100%)`,
          zIndex: 1,
        }}
      />
    </Box>
  );
};

export default HeroSection;
