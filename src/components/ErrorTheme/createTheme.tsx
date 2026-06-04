import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    error: {
      main: '#ff0000',
    },
  },

  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            color: '#ff0000',
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-error': {
            color: '#ff0000',
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ff0000',
          },
        },
      },
    },
  },
});

export default theme;
