import React from "react";
//import ReactDOM from 'react-dom';
// import VideoText from './videoText.js';
import Player from './Player.js';
import YoutubeDownload from "./YoutubeDownload.js";
import Playlist from "./Playlist.js";
//import CreateFolderForm from './CreateFolderForm.js';
import styles from './utils/styles.js';
import theme from './utils/appTheme.js';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Divider, Paper, List, ListItem, ListItemIcon, ListItemText, LinearProgress, Drawer, Toolbar, IconButton } from "@mui/material";
import GetAppIcon from '@mui/icons-material/GetApp';
import AddIcon from '@mui/icons-material/Add';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CreateFolderForm from "./CreateFolderForm.js";
import CloseIcon from '@mui/icons-material/Close';
//import ResizeableInput from './ResizeableInput.js';
//import { NativeSelect, MenuList, MenuItem } from '@mui/material';
const { ipcRenderer } = window.require("electron");
const downloadFolder = './videos/';
let downloadingFiles = [];
// let display;
export let windowDimensions;
class App extends React.Component{ 
  constructor(props){
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state = {
      width:window.innerWidth, 
      height:window.innerHeight,
      linkSubmitted:false, 
      fileName:"", 
      fileType:"mp3",
      foldersList:["null"],
      page:"downloader",
      fileIndex:null,
      filesList:[],
      selectedFile:"",
      downloadingFile:[]
    };
    //this.state = {variable:'some value'}
  }
  componentDidMount() {
    console.log('mount')
    this.getFoldersList(downloadFolder);
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    
    ipcRenderer.on('newFolder',(event,folder)=>{
      this.getFoldersList(downloadFolder);
      this.setState({page:folder})
    })
    ipcRenderer.on('folderDeleted',(event)=>{
      this.getFoldersList(downloadFolder);
      this.setState({page:"Downloads"})
    })
    ipcRenderer.on('loadingBar',(event,vid)=>{
      //console.log(vid.folder);
      //console.log(vid.name + ": " + vid.progress);
      let findFile = downloadingFiles.findIndex((file)=> file.name === vid.name);
      if( findFile === -1){
        downloadingFiles.push({name:vid.name, progress:vid.progress});
      }else{
        downloadingFiles[findFile].progress = vid.progress;
        if(vid.progress === 100){
          downloadingFiles.splice(downloadingFiles[findFile],1)
        }
      }
      // console.log(vid.progress);
      let files=[];
      downloadingFiles.forEach((file)=>{
        files.push(
          <div>
            <div style={{marginLeft:"10px",marginRight:'10px',color:"#007d85",width:"90%",textOverflow:"ellipsis", overflow:"hidden",whiteSpace:"nowrap"}}>{file.name}</div>
            <div style={{display:"flex"}}>
              <LinearProgress style={{width:"100%",marginTop:"3px",marginRight:"10px",marginLeft:'10px'}}variant="determinate" value={file.progress}></LinearProgress>
              <div style={{color:"#007d85",bottom:"5px",position:"relative",display:"inline-block"}}>{file.progress}%</div>
            </div>
          </div>
        );
      })
      // not keeping up bc cant setstate that fast maybe make it so it only setstates every second 
      this.setState({downloadingFile:files})
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    windowDimensions = {width: window.innerWidth, height: window.innerHeight}
  }
  openFolders = ()=>{
    ipcRenderer.send('openFolders', downloadFolder)
  }
  getFoldersList=(path)=>{
    ipcRenderer.send('getFolders', path);
    ipcRenderer.on('gotFolders',(event,folders)=>{
      this.setState({foldersList:folders},()=>{
        if(folders.findIndex((folder)=> folder === "Downloads") === -1){
          ipcRenderer.send('createFolder','Downloads')
        }
      });
    })
  }
  handlePlaylistSelect=(event,folderName)=>{
    this.setState({page:folderName});
  }
  handleDownloadSelect=(event)=>{
    this.setState({page:"downloader"});
  }
  handleFileSelect=(data)=>{
    this.setState({fileIndex:data[1]});
    this.setState({filesList:data[0]});
  }
  handleNewSelectedFile=(data)=>{
    this.setState({selectedFile:data});
  }
  downloadingVideo=(data)=>{
    ipcRenderer.send('download', data);
  }
  minimize=()=>{
    ipcRenderer.send('minimize');
  }
  close=()=>{
    ipcRenderer.send('close')
  }
  render(){
    const classes = styles;
    return (
      //App
      //, backgroundColor:"#222831"}
      <div className="App" style={{height:"100%", width:"100%", overflow: "hidden"}}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Toolbar style={classes.toolbar}>
            <p style={classes.title}>Youtube Downloader + Player</p>
            <IconButton 
              style={classes.titleButtons}
              onClick={this.minimize}
            >
              <MinimizeIcon style={{fontSize:"15px",marginBottom:"8px"}} color="primary"/>
            </IconButton>
            <IconButton 
              style={classes.titleButtons}
              onClick={this.close}
            >
              <CloseIcon style={{fontSize:"15px",marginBottom:"auto",marginTop:"auto"}} color="primary"/>
            </IconButton>
            <Divider/>
          </Toolbar>
          <div color="primary" style= {classes.root} >
            <Drawer 
              sx={{
                "& .MuiPaper-root": {
                  top:"25px",
                  height:(this.state.height-25) + "px",
                },
            }}
              variant = "permanent" 
              anchor="left"
            >
              <List>
                <ListItem button onClick={this.handleDownloadSelect} key="0">
                  <ListItemIcon>
                    <GetAppIcon fontSize="large" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={"Download"}/>
                </ListItem>
                <ListItem onClick={this.openFolders} button key ="1">
                  <ListItemIcon>
                    <AddIcon fontSize="large" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={"Import"}/>
                </ListItem>
              </List>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div style={{color:"#007d85", fontSize:"17px"}}>Playlists</div>
                  <CreateFolderForm/>
              </div>
              <Divider/>
                {/* playlist list */}
                <List sx={{height:(this.state.height-350)+"px",
                width:"200px", 
                display:'flex', 
                flexDirection:"column",
                overflow: "auto",
                overflowX: "hidden",

                '&::-webkit-scrollbar': {
                  width: '10px',
                  height: '10px', 
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor:"#00adb5"
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor:"#007d85",
                }
                }}>
                {
                  this.state.foldersList.map((text) => (
                    <ListItem sx={{width:"185px",minHeight:"50px",whiteSpace: "nowrap",textOverflow: "ellipsis",overflow:"hidden"}} button key={text} onClick={(event)=>{this.handlePlaylistSelect(event, text)}}>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))
                }
                </List>
              {/* <div style={{width:"180px"}}>
                <p style = {classes.drawerTabs}>youtube download</p>
                <p style = {classes.drawerTabs}>downloads</p>
              </div> */}
            </Drawer>
            <Player key = {this.state.filesList} sendFileToParent = {this.handleNewSelectedFile} index = {this.state.fileIndex} filesList ={this.state.filesList} filePath={"../../app.asar.unpacked/build/videos/"+this.state.page+"/"}/>
          </div>
            <Paper style={{position:"fixed",backgroundColor:"black", width:"25%", left:this.state.width*.75}}>
              {this.state.downloadingFile}
              {/* <div>
                <div style={{marginLeft:"10px",color:"#007d85",width:"90%",textOverflow:"ellipsis", overflow:"hidden",whiteSpace:"nowrap"}}>Title of asdasddssdasdsadadsasddadasdsaddasFile</div>
                <div style={{display:"flex"}}>
                  <LinearProgress style={{width:"100%",marginTop:"3px",marginRight:"10px",marginLeft:'10px'}}variant="determinate" value={50}></LinearProgress>
                  <div style={{color:"#007d85",bottom:"5px",position:"relative",display:"inline-block"}}>50%</div>
                </div>
              </div> */}
            </Paper>
          {(()=>{
            let component;
            // console.log(this.state.page);
            if(this.state.page === "downloader"){
              component = <YoutubeDownload downloadVideo = {this.downloadingVideo}/>;
            }else{
              component = <Playlist appHeight = {this.state.height} folders = {this.state.foldersList} selectedFile = {this.state.selectedFile} sendFileToParent = {this.handleFileSelect} key= {this.state.page} path={this.state.page}/>
            }
            return(
              component
            )
          })()}
        </ThemeProvider>
      </div>
    );
  }
}
export default App;