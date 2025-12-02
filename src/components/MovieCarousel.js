import React, { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { motion } from "framer-motion";
import ModernMovieCard from "./ModernMovieCard";
import { tokens, hideScrollbar } from "../theme";

const MovieCarousel = ({ title, movies, subtitle }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.75;
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <Box
      sx={{
        mb: 8,
        position: "relative",
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Section Header - Clean & Minimal */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: tokens.typography.fontWeight.bold,
            color: tokens.colors.light[50],
            fontSize: { xs: tokens.typography.fontSize.xl, md: tokens.typography.fontSize["2xl"] },
            mb: subtitle ? 0.5 : 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: tokens.colors.light[500],
              fontSize: tokens.typography.fontSize.sm,
              fontWeight: tokens.typography.fontWeight.medium,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Carousel Container */}
      <Box
        sx={{
          position: "relative",
          "&:hover .carousel-arrow": {
            opacity: 1,
          },
        }}
      >
        {/* Left Arrow - Minimal Style */}
        {showLeftArrow && (
          <Box
            sx={{
              position: "absolute",
              left: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <IconButton
              className="carousel-arrow"
              onClick={() => scroll("left")}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: tokens.colors.dark[800],
                width: 48,
                height: 48,
                opacity: 0,
                transition: tokens.transitions.all,
                boxShadow: tokens.shadows.lg,
                "&:hover": {
                  backgroundColor: tokens.colors.light[50],
                  transform: "scale(1.08)",
                },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        )}

        {/* Right Arrow - Minimal Style */}
        {showRightArrow && (
          <Box
            sx={{
              position: "absolute",
              right: -16,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <IconButton
              className="carousel-arrow"
              onClick={() => scroll("right")}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: tokens.colors.dark[800],
                width: 48,
                height: 48,
                opacity: 0,
                transition: tokens.transitions.all,
                boxShadow: tokens.shadows.lg,
                "&:hover": {
                  backgroundColor: tokens.colors.light[50],
                  transform: "scale(1.08)",
                },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        )}

        {/* Scrollable Movies Container - With overflow padding to prevent clipping */}
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            overflowY: "visible", // Changed from hidden to visible
            py: 3, // Add vertical padding to prevent clipping
            mx: -1, // Negative margin to compensate for padding
            px: 1,
            ...hideScrollbar(),
            scrollSnapType: "x proximity",
          }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              style={{
                minWidth: "220px",
                maxWidth: "220px",
                scrollSnapAlign: "start",
              }}
            >
              <ModernMovieCard movie={movie} />
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MovieCarousel;
