import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import { createCustomTheme } from "./theme";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MovieDetail from "./pages/MovieDetail";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";

const AppContent = () => {
  // Always use dark mode theme
  const theme = React.useMemo(() => createCustomTheme("dark"), []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <WatchlistProvider>
          <AppContent />
        </WatchlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
