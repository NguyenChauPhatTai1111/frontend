import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

import { useKBar } from 'kbar';

export const CustomNavbar: React.FC = () => {
  const { query } = useKBar();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* LEFT */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton edge="start">
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={600}>
            My Dashboard
          </Typography>
        </Box>

        {/* CENTER - SEARCH TRIGGER (KBar) */}
        <Box
          onClick={() => query.toggle()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.8,
            border: '1px solid #ddd',
            borderRadius: 2,
            cursor: 'pointer',
            minWidth: 300,
            color: 'gray',
          }}
        >
          <SearchIcon fontSize="small" />
          <Typography variant="body2">Search... (Ctrl + K)</Typography>
        </Box>

        {/* RIGHT - USER */}
        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={handleMenuOpen} startIcon={<Avatar />}>
            Admin
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
