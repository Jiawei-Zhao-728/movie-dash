import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import MovieIcon from "@mui/icons-material/Movie";
import { authService } from "../services/authService";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const favoritesData = await authService.getFavorites();
        setFavorites(favoritesData);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  // Get first letter of username for avatar
  const avatarLetter = user.username ? user.username[0].toUpperCase() : "U";

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header Card */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            mb: 4,
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 3,
              }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "primary.main",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                }}
              >
                {avatarLetter}
              </Avatar>

              {/* User Info */}
              <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {user.username}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon fontSize="small" color="action" />
                    <Typography variant="body1" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Member ID: #{user.id}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Logout Button */}
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Your Activity
            </Typography>
            <Divider sx={{ my: 2 }} />

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      bgcolor: "primary.main",
                      color: "white",
                      borderRadius: 2,
                    }}
                  >
                    <MovieIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h3" fontWeight={700}>
                      {favorites.length}
                    </Typography>
                    <Typography variant="body2">Favorite Movies</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      bgcolor: "secondary.main",
                      color: "white",
                      borderRadius: 2,
                    }}
                  >
                    <MovieIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="h3" fontWeight={700}>
                      0
                    </Typography>
                    <Typography variant="body2">Reviews Written</Typography>
                  </Box>
                </Grid>
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card elevation={3} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  justifyContent: "flex-start",
                }}
              >
                Browse Movies
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/favorites")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  justifyContent: "flex-start",
                }}
              >
                View My Favorites
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Profile;
