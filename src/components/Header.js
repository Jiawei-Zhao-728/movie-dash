import React, { useState } from "react";
import {
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import { tokens } from "../theme";

/**
 * Header Component
 *
 * Main navigation header with glass morphism design, fixed at top of viewport.
 * Conditionally displays SearchBar on home page, and adapts layout for authenticated users.
 *
 * Layout:
 * - Left: Menu icon (authenticated only) + Logo
 * - Center: SearchBar (home page only)
 * - Right: User avatar & menu (authenticated) OR Sign In button (guest)
 *
 * Features:
 * - Fixed positioning with backdrop blur for modern glass effect
 * - Responsive layout with centered search on home page
 * - User menu with profile navigation and logout
 * - Sidebar toggle for mobile navigation
 * - Height: 60px for minimal, clean design
 *
 * @example
 * <Header />
 */
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // State for user menu dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  // State for sidebar (mobile navigation)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine if we're on home page to conditionally show SearchBar
  const isHomePage = location.pathname === "/";

  /**
   * Open user menu dropdown
   * @param {Event} event - Click event from avatar button
   */
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Close user menu dropdown
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Handle user logout
   * Closes menu and triggers logout from AuthContext
   */
  const handleLogout = () => {
    handleClose();
    logout();
  };

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Minimal Header - Clean Design */}
      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(20, 20, 20, 0.8)",
          backdropFilter: `blur(${tokens.blur.lg})`,
          WebkitBackdropFilter: `blur(${tokens.blur.lg})`,
          borderBottom: `1px solid ${tokens.colors.dark[700]}`,
        }}
      >
        {/* Top Bar with Logo and User */}
        <Box
          sx={{
            height: "60px",
            display: "flex",
            alignItems: "center",
            px: 3,
          }}
        >
          {/* Menu Icon */}
          {user && (
            <IconButton
              onClick={toggleSidebar}
              size="small"
              sx={{
                color: tokens.colors.light[300],
                mr: 2,
                transition: tokens.transitions.all,
                "&:hover": {
                  color: tokens.colors.light[100],
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate("/")}
            sx={{
              cursor: "pointer",
              fontWeight: tokens.typography.fontWeight.bold,
              fontSize: tokens.typography.fontSize.lg,
              background: tokens.gradients.primary,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
              transition: tokens.transitions.all,
              flexShrink: 0,
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            MovieDash
          </Typography>

          {/* Search Bar - Centered on Home Page */}
          {isHomePage && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                px: 3,
              }}
            >
              <Box sx={{ width: "100%", maxWidth: "600px" }}>
                <SearchBar />
              </Box>
            </Box>
          )}

          {/* Spacer for non-home pages */}
          {!isHomePage && <Box sx={{ flex: 1 }} />}

          {/* User Section */}
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                variant="body2"
                sx={{
                  color: tokens.colors.light[300],
                  fontSize: tokens.typography.fontSize.sm,
                  fontWeight: tokens.typography.fontWeight.medium,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {user.username}
              </Typography>
              <IconButton onClick={handleMenu} size="small" sx={{ padding: 0 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: tokens.gradients.primary,
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.semibold,
                    transition: tokens.transitions.all,
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  mt: 1,
                  "& .MuiPaper-root": {
                    background: "rgba(30, 30, 30, 0.95)",
                    backdropFilter: `blur(${tokens.blur.lg})`,
                    borderRadius: tokens.borderRadius.lg,
                    border: `1px solid ${tokens.colors.dark[600]}`,
                    boxShadow: tokens.shadows.xl,
                    minWidth: 140,
                  },
                  "& .MuiMenuItem-root": {
                    color: tokens.colors.light[200],
                    fontSize: tokens.typography.fontSize.sm,
                    fontWeight: tokens.typography.fontWeight.medium,
                    py: 1.5,
                    px: 2.5,
                    transition: tokens.transitions.all,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.15)",
                      color: tokens.colors.light[50],
                    },
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box
              onClick={() => navigate("/login")}
              sx={{
                px: 3,
                py: 1,
                borderRadius: tokens.borderRadius.full,
                background: tokens.gradients.primary,
                color: tokens.colors.light[50],
                fontSize: tokens.typography.fontSize.sm,
                fontWeight: tokens.typography.fontWeight.semibold,
                cursor: "pointer",
                transition: tokens.transitions.all,
                "&:hover": {
                  background: tokens.gradients.primaryReverse,
                  transform: "translateY(-1px)",
                  boxShadow: `0 4px 12px ${tokens.colors.brand.primary}40`,
                },
              }}
            >
              Sign In
            </Box>
          )}
        </Box>
      </Box>

      {/* Add padding to body to account for fixed header */}
      <Box sx={{ height: "60px" }} />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;
