import { ThemeProvider, createTheme, PaletteMode } from '@mui/material/styles';
import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ColorModeContextType = {
  mode: PaletteMode;
  setMode: () => void;
};

const getDesignTokens = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#7c3aed',
      },
      secondary: {
        main: '#22d3ee',
      },
      error: {
        main: '#f43f5e',
      },
      warning: {
        main: '#f59e0b',
      },
      success: {
        main: '#22c55e',
      },
      background: {
        default:
          mode === 'dark'
            ? '#070b18'
            : 'radial-gradient(circle at top left, #eef2ff, #ffffff)',
        paper: mode === 'dark' ? 'rgba(15, 23, 42, 0.92)' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f8fafc' : '#111827',
        secondary: mode === 'dark' ? '#cbd5e1' : '#4b5563',
      },
    },
    typography: {
      fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: '100vh',
            backgroundColor: mode === 'dark' ? '#060816' : '#eef2ff',
            backgroundImage:
              mode === 'dark'
                ? 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 25%), radial-gradient(circle at bottom right, rgba(168,85,247,0.18), transparent 30%)'
                : 'radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 30%), radial-gradient(circle at bottom right, rgba(168,85,247,0.10), transparent 35%)',
            color: mode === 'dark' ? '#e2e8f0' : '#111827',
            transition: 'background-color 0.25s ease, color 0.25s ease',
          },
          '#root': {
            minHeight: '100vh',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(20px)',
            border:
              mode === 'dark'
                ? '1px solid rgba(255,255,255,0.06)'
                : '1px solid rgba(148,163,184,0.14)',
            boxShadow:
              mode === 'dark'
                ? '0 24px 70px rgba(0, 0, 0, 0.28)'
                : '0 20px 60px rgba(15, 23, 42, 0.08)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === 'dark'
                ? 'rgba(15, 23, 42, 0.94)'
                : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(18px)',
            boxShadow:
              mode === 'dark'
                ? '0 18px 45px rgba(0, 0, 0, 0.25)'
                : '0 14px 35px rgba(15, 23, 42, 0.08)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            textTransform: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 18px 40px rgba(124, 77, 255, 0.18)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor:
              mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor:
                mode === 'dark'
                  ? 'rgba(59,130,246,0.6)'
                  : 'rgba(59,130,246,0.35)',
            },
          },
          notchedOutline: {
            borderColor:
              mode === 'dark'
                ? 'rgba(148,163,184,0.28)'
                : 'rgba(148,163,184,0.5)',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? '#cbd5e1' : '#4b5563',
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: '#f43f5e',
          },
        },
      },
    },
  });

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType,
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [mode, setMode] = useState<PaletteMode>('dark');

  useEffect(() => {
    const colorModeFromLocalStorage = localStorage.getItem(
      'colorMode',
    ) as PaletteMode | null;
    const isSystemPreferenceDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    const systemPreference = isSystemPreferenceDark ? 'dark' : 'light';
    setMode(colorModeFromLocalStorage || systemPreference);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('colorMode', mode);
  }, [mode]);

  const setColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getDesignTokens(mode), [mode]);

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
