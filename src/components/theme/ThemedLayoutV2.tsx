import React from 'react';
import { ThemedLayout, ThemedTitle } from '@refinedev/mui';
import { Outlet } from 'react-router-dom';
import { Box, Typography, IconButton } from '@mui/material';
import { useKBar } from 'kbar';
import { useGetIdentity } from '@refinedev/core';
import { useContext } from 'react';
import { ColorModeContext } from '../../contexts/color-mode';
import { keyframes } from '@mui/system';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const CustomTitle: React.FC = () => {
  const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;
  return (
    <ThemedTitle
      collapsed={false}
      text="ProjectStore"
      icon={
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            background:
              'linear-gradient(135deg,#3b82f6,#a855f7,#06b6d4,#3b82f6)',
            backgroundSize: '300% 300%',

            animation: `${gradient} 4s ease infinite`,
          }}
        >
          <Typography fontWeight={800} fontSize={18} color="#fff">
            P
          </Typography>
        </Box>
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
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        bgcolor: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(18px)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.16)',
      }}
    >
      <Typography fontWeight={700} letterSpacing={0.4} color="primary.main">
        Control Center
      </Typography>

      <Box
        onClick={() => query.toggle()}
        sx={{
          px: 2.2,
          py: 0.85,
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 3,
          cursor: 'pointer',
          fontSize: 14,
          color: 'text.secondary',
          bgcolor: 'background.default',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        Search (Ctrl + K)
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          onClick={setMode}
          size="small"
          sx={{ color: 'text.primary' }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>

        <Typography fontSize={14} color="text.primary">
          {identity?.name ?? 'Administrator'}
        </Typography>
      </Box>
    </Box>
  );
};

export const ThemeLayoutV2: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 25%), radial-gradient(circle at bottom right, rgba(168,85,247,0.18), transparent 34%)',
      }}
    >
      <ThemedLayout Header={CustomHeader} Title={CustomTitle}>
        <Outlet />
      </ThemedLayout>
    </Box>
  );
};
