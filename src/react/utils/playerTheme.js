import { createTheme } from '@mui/material/styles';

const playerTheme = createTheme({
  components:{
    // MuiButton: {
    //     root: {

    //     }, 
    //   },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#000000"
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
    MuiDialog:{
      styleOverrides: {
        root:{
          backgroundColor:"#00adb5",
        },
        BackdropProps:{
          backgroundColor:"#00adb5",
        },
        PaperProps:{
          backgroundColor:"#00adb5",
        }
      }
    },
    MuiSvgIcon:{
      styleOverrides:{
        root:{
          color:"#007d85"
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
          "&:hover": {
            color: "#4dadb5",
            "& .MuiSvgIcon-root ": {
              color: "#4dadb5"
            }
          },
        },
      } 
    },
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
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '*': {
            'scrollbar-width': 'thin',
          },
          // '& .MuiDialogContent-root': {
          //   backgroundColor:"#00adb5"
          // },
          // '& .MuiDialogActions-root': {
          //   backgroundColor:"#00adb5"
          // },
          // '*::-webkit-scrollbar': {
          //   width: '10px',
          //   height: '10px',
            
          // },
          // '*::-webkit-scrollbar-track': {
          //   backgroundColor:"#00adb5"
            
          // },
          // '*::-webkit-scrollbar-thumb': {
          //   backgroundColor:"#007d85",
          // }
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
export default playerTheme;