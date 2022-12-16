import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components:{
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& $notchedOutline": {
            borderColor: "#62676f"
          },
          "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
            borderColor: "#62676f"
          },
          "& .MuiSvgIcon-root": {
            color: "#62676f",
          }
        }  
      }

    },
    MuiInputBase :{
      styleOverrides: {
        input:{
          color:"#00adb5",
        }
      }

    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color:"#007d85"
        }
      }
      
    },
    MuiInput: {
      styleOverrides: {
        // props:{
        //   inputProps: { spellCheck: 'false' }
        // },
        underline: {
          "&:before": {
            borderBottomColor:"#62676f"
          },
          '&:hover:not($disabled):before': {
            borderBottomColor:"#62676f"
          },
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#000000"
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color:"#007d85",
          '&$selected': {
            backgroundColor: "#4dadb5",
            "& .MuiSvgIcon-root ": {
              color: "#007d85"
            }
          },
        },
        button:{
          "&:hover": {
            color: "#4dadb5",
            "& .MuiSvgIcon-root ": {
              color: "#4dadb5"
            }
          },
        } 
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color:"#007d85",
          "& .MuiSvgIcon-root ": {
            color: "#007d85"
          },
          "&:hover": {
            color: "#4dadb5",
            "& .MuiSvgIcon-root ": {
              color: "#4dadb5"
            }
          },
        }
      }
    },
    MuiSvgIcon:{
      styleOverrides: {
        root:{
          "&:hover": {
            color: "#4dadb5",
          },
        }
      }
      
    },
    MuiDivider:{
      styleOverrides:{
        root:{
          backgroundColor:"#007d85"
        }
      }
    },
    MuiPaper:{
      styleOverrides: {
        root:{
          backgroundColor:"#121921",
        }
      }
    },
    MuiMenuItem:{
      styleOverrides: {
        root:{
          color:"#4dadb5"
        }
      }
    }
  },
  palette: {
    primary: {
      main: '#007d85',
      light:'#4dadb5',
      dark:"#005058",
      contrastText: '#fff',
    },
    secondary: {
      main: '#00adb5',
      light:'#5cdfe7',
      dark:"#007d85",
      contrastText: '#EEEEEE',
    },
    background:{
      default:"#121921"
    }
  },
});
export default theme;