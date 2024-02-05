import { createTheme, responsiveFontSizes } from '@mui/material';

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: '#FF661F',
        dark: '#8F2D00',
        light: '#FF9D70'
      },
      secondary: {
        main: '#BF00FF',
        dark: '#7A00A3',
        light: '#E085FF'
      }
    },
    typography: {
      h1: {
        fontWeight: 'bold',
        marginBottom: 20
      },
      h2: {
        fontWeight: 'bold',
        marginBottom: 20
      },
      h3: {
        fontWeight: 'bold',
        marginBottom: 20
      },
      h4: {
        fontWeight: 'bold',
        marginBottom: 20
      },
      h5: {
        fontWeight: 'bold',
        marginBottom: 20
      },
      h6: {
        fontWeight: 'bold',
        marginBottom: 20
      }
    },
    components: {
      MuiTextField: {
        defaultProps: {
          size: 'small',
          fullWidth: true
        },
        styleOverrides: {
          root: {
            '&:not(:last-child)': {
              marginBottom: 10
            }
          }
        }
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
              cursor: 'pointer'
            }
          }
        }
      },
      MuiSelect: {
        defaultProps: {
          size: 'small'
        },
        styleOverrides: {
          root: {
            '&:not(:last-child)': {
              marginBottom: 10
            }
          }
        }
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            paddingTop: '5px !important'
          }
        }
      }
    }
  })
);
