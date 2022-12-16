import React from 'react';
import { IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
const { ipcRenderer } = window.require("electron");

export default function CreateFolderForm() {
    const [open, setOpen] = React.useState(false);
    let setTextValue = "";
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const handleTextFieldChange=(event)=>{
        setTextValue = event.target.value;
    }
    const handleSendForm= () =>{
        console.log(setTextValue);
        ipcRenderer.send('createFolder', setTextValue);
        setOpen(false);
    }
  
    return (
      <div>
        <IconButton onClick={handleClickOpen}>
          <CreateNewFolderIcon color="primary" fontSize="large"/>
        </IconButton>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <div style={{backgroundColor:"#121921"}}>
          <DialogTitle style={{color:"#00adb5"}} id="form-dialog-title">Create New Playlist</DialogTitle>
          <DialogContent color="secondary">
            <TextField
              label="Playlist Name"
              onChange={handleTextFieldChange}
              autoFocus
              margin="dense"
              id="name"
              type="name"
              fullWidth
              color="secondary"
            />
          </DialogContent>
          <DialogActions color="secondary">
            <Button color="secondary" onClick={handleClose} >
              Cancel
            </Button>
            <Button color="secondary" onClick={handleSendForm}>
              Create
            </Button>
          </DialogActions>
          </div>
        </Dialog>
      </div>
    );
  }