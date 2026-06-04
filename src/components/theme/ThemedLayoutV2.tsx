import React from 'react';
import { ThemedLayout, ThemedTitle } from '@refinedev/mui';
import { Outlet } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { useKBar } from 'kbar';
import { useGetIdentity } from '@refinedev/core';
import { useContext } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const CustomTitle: React.FC = () => {
  return (
    <ThemedTitle
      collapsed={false}
      text="My Admin"
      icon={
        <img
          src="/logo.png"
          alt="logo"
          style={{ width: 28, height: 28, borderRadius: 6 }}
        />
      }
    />
  );
};

const CustomHeader: React.FC = () => {
  const { query } = useKBar();

  const { mode, setMode } = useContext(ColorModeContext);

  const { data: identity } = useGetIdentity<{
    name: string;
    email: string;
  }>();

  return (
    <Box
      sx={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        borderBottom: '1px solid #eee',
        bgcolor: 'background.paper',
      }}
    >
      <Typography fontWeight={600}>Dashboard</Typography>

      <Box
        onClick={() => query.toggle()}
        sx={{
          px: 2,
          py: 0.8,
          border: '1px solid #ddd',
          borderRadius: 2,
          cursor: 'pointer',
          fontSize: 14,
          color: 'text.secondary',
        }}
      >
        Search (Ctrl + K)
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton onClick={setMode} size="small">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <Typography fontSize={14}>{identity?.name ?? 'admin'}</Typography>
      </Box>
    </Box>
  );
};

export const ThemeLayoutV2: React.FC = () => {
  return (
    <ThemedLayout Header={CustomHeader} Title={CustomTitle}>
      <Outlet />
    </ThemedLayout>
  );
};
