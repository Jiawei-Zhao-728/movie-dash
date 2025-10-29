import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  Container,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import MovieIcon from "@mui/icons-material/Movie";

const Register = () => {
  const { user, register, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const theme = useTheme();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!username || !email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }
    await register(username, email, password);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: "visible",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Logo and Title */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    mb: 2,
                  }}
                >
                  <MovieIcon sx={{ fontSize: 40, color: "white" }} />
                </Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight={700}
                  gutterBottom
                >
                  Create Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sign up to get started with MovieDash
                </Typography>
              </Box>

              {/* Error Alert */}
              {(formError || error) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {formError || error}
                </Alert>
              )}

              {/* Register Form */}
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                  margin="normal"
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  margin="normal"
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  margin="normal"
                  variant="outlined"
                  required
                  helperText="Must be at least 6 characters"
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {loading ? "Registering..." : "Create Account"}
                </Button>
              </Box>

              {/* Login Link */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    underline="hover"
                    fontWeight={600}
                  >
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;
