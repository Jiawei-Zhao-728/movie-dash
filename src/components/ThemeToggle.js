import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            backgroundColor: isDarkMode ? "primary.dark" : "primary.light",
            color: isDarkMode ? "common.white" : "primary.main",
            borderRadius: "50%",
            width: 56,
            height: 56,
            boxShadow: 3,
            "&:hover": {
              backgroundColor: isDarkMode ? "primary.main" : "primary.light",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          <motion.div
            key={isDarkMode ? "dark" : "light"}
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </motion.div>
        </IconButton>
      </Tooltip>
    </motion.div>
  );
};

export default ThemeToggle;
