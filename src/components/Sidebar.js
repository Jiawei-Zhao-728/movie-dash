import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            component="img"
            src={user.picture}
            alt={user.name}
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
            }}
          />
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
        <Divider />
      </Box>

      <List>
        <ListItem button>
          <ListItemIcon>
            <FavoriteIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HistoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Watch History" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BookmarkIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Watchlist" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
