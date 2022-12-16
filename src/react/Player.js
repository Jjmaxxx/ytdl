import React from "react";
import ReactPlayer from 'react-player/file';
import styles from './utils/styles.js';
import { Drawer , IconButton, Slider, List, ListItemButton, ListItemIcon, ListItemText, Grid, Dialog} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MovieIcon from '@mui/icons-material/Movie';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CloseIcon from '@mui/icons-material/Close';
import LoopIcon from '@mui/icons-material/Loop';
import playerTheme from './utils/playerTheme.js';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import helperFunctions from './utils/helperFunctions.js';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import Slide from '@mui/material/Slide';
let video,fileType,vidTitle,pipWidth,pipHeight, originalPlaylist;
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
class Player extends React.Component{
    constructor(props){
        super(props);
        this.play = this.play.bind(this);
        this.state = {
            playlist:[],
            filePath:"",
            hoverPlayer:true,
            playing: localStorage.getItem('playing') ? JSON.parse(localStorage.getItem('playing')) : true ,
            volume:localStorage.getItem('volume') ? JSON.parse(localStorage.getItem('volume')) : 0.1 ,
            videoTime:"0:00",
            rawVideoTime:0,
            duration:0,
            seeking:false,
            loop:localStorage.getItem('loop') ? JSON.parse(localStorage.getItem('loop')) : false ,
            pip:false,
            openQueue:false,
            //if can find shuffle in localstorage, if true then get it, if false then return false
            shuffle: localStorage.getItem('shuffle') ? JSON.parse(localStorage.getItem('shuffle')) : false ,
            selected:"",
            selectedVideo: false,
            video:"",
            videoSelection:null,
            vidIndex:"",
            currSong:""
        }
    }
    componentDidMount(){
        //this.getNewVideo(this.props.index);
        //console.log('remounted')
        //console.log(this.props.filesList)
        originalPlaylist = this.props.filesList;
        //console.log(originalPlaylist);
        this.setState({playlist:originalPlaylist});
        this.setState({filePath:this.props.filePath});
        pipWidth ="0px";
        pipHeight="0px";
    }
    componentDidUpdate(prevProps, prevState){
        //is not getting run immediately after selectedVideo becomes true
        // console.log(prevProps.index);
        // console.log(prevState);
        if(this.state.selectedVideo === true){
            this.setState({selectedVideo:false},()=>{
                this.setState({playlist:originalPlaylist}, this.getNewVideo(this.state.videoSelection));
                this.setState({shuffle:false})
            });
        }
    }
    static getDerivedStateFromProps(props,state){
        if(props.index !== null && state.prevVideoSelection !== state.videoSelection){
            // console.log("prev state:" + state.prevVideoSelection);
            // console.log("state: " + state.videoSelection);
            return{
                videoSelection:props.index,   
                prevVideoSelection: state.videoSelection, 
                selectedVideo:true
            }
        }
        return{
            videoSelection:props.index,
        }
    }
    ref = player => {
        this.player = player;
        // if(this.player != null){
        //     console.log(this.player.player);
        // }
        // console.log(this.player.getActivePlayer());
        //this.player.requestPictureInPicture();
        //console.log(this.player);
    }
    // this.setState({filesList:this.props.filesList});
    // this.setState({video:this.props.filePath});
    getNewVideo= (index)=>{
        this.setState({videoTime:"0:00"});
        this.setState({rawVideoTime:0})
        this.setState({pip:false});
        this.setState({vidIndex:index},()=>{
            this.setState({currSong:this.state.playlist[this.state.vidIndex][0]},()=>{
                // console.log(this.state.currSong)
                if(this.state.playlist.length > 0){
                    this.setState({video:this.state.filePath + this.state.currSong},()=>{
                        fileType = this.state.video.substring(this.state.video.length-3);
                        vidTitle = this.state.video.substring(0,this.state.video.length-4).substring(this.state.video.lastIndexOf('/')+1);
                        this.setState({selected:this.state.playlist[index][0]},()=>{
                            this.props.sendFileToParent(this.state.selected);
                        });
                        if(fileType === "mp4"){
                            pipWidth = "250px";
                            pipHeight = "120px";
                        }else{
                            pipWidth = "0px";
                            pipHeight = "0px";
                        }
                        //if this console.log is not instant when new file this will break fix it
                        // console.log(this.state.video);
                        // console.log(this.state.playlist);
                    });
                }
            })
        });
    }
    hoverOverPlayer=()=>{
        this.setState({hoverPlayer:false});
    }
    hoverOutPlayer=()=>{
        this.setState({hoverPlayer:true});
    }
    queue=()=>{
        this.setState({openQueue:true});
    }
    closeQueue=()=>{
        this.setState({openQueue:false})
    }
    playerReady= ()=>{
        // console.log('run')
        if(video === null){
            console.log('no video found')
        }
    }
    play=()=>{
        if(this.state.playing){
            this.setState({playing:false},()=>{
                window.localStorage.setItem('playing', JSON.stringify(this.state.playing));
            });
        }else{
            this.setState({playing:true},()=>{
                window.localStorage.setItem('playing', JSON.stringify(this.state.playing));
            });
        }
    }
    rewind=()=>{
        let goToPrevVid = this.state.vidIndex-1;
        if(Math.trunc(this.player.getCurrentTime()) < 5 && goToPrevVid >= 0){
            this.getNewVideo(goToPrevVid);
        }else{
            this.player.seekTo(0);
        }
    }
    changeVolume=(event, value)=>{
        this.setState({volume:value/500},()=>{
            window.localStorage.setItem('volume', JSON.stringify(this.state.volume));
        });
    }
    //https://bost.ocks.org/mike/shuffle/
    shufflePlaylist=()=>{
        let songsList = Array.from(originalPlaylist);
        //console.log(songsList);
        let currSong = songsList[this.state.vidIndex];
        let i, unshuffled, temp;
        unshuffled = songsList.length;
        while(unshuffled){
            unshuffled= unshuffled- 1;
            i= Math.floor(Math.random()*unshuffled);
            temp = songsList[unshuffled];
            songsList[unshuffled] = songsList[i];
            songsList[i] = temp;
            //console.log(songsList);
           // console.log(this.state.playlist);
        }
        songsList.splice(songsList.findIndex((element)=> element === currSong), 1);
        songsList.splice(0,0, currSong);
        //console.log(songsList);
        this.setState({playlist:songsList},()=>{
            //console.log(this.state.filesList);
        });
        this.setState({vidIndex:0});
    }
    pip=()=>{
        if(!this.state.pip){
            this.setState({pip:true});
        }else{
            this.setState({pip:false});
        }
    }
    pipDisable=()=>{
        this.setState({pip:false});
    }
    shuffle=()=>{
        //console.log(originalPlaylist);
        if(this.state.shuffle){
            this.setState({shuffle:false});
            this.setState({playlist:originalPlaylist},()=>{
                let songsList = Array.from(originalPlaylist);
                this.setState({vidIndex:helperFunctions.findSong(songsList, this.state.currSong)});
                // console.log(this.state.playlist)
            });
            window.localStorage.setItem('shuffle', JSON.stringify(false));
            //find index of current song, set it to that
        }else{
            this.setState({shuffle:true});
            //console.log(this.state.playlist);
            this.shufflePlaylist();
            window.localStorage.setItem('shuffle', JSON.stringify(true));
        }
        // console.log(this.state.vidIndex);
        // console.log(this.state.playlist);
        //console.log(JSON.parse(localStorage.getItem('shuffle')));
    }
    loop=()=>{
        if(!this.state.loop){
            this.setState({loop:true},()=>{
                window.localStorage.setItem('loop', JSON.stringify(this.state.loop));
            });
        }else{
            this.setState({loop:false},()=>{
                window.localStorage.setItem('loop', JSON.stringify(this.state.loop));
            });
        }
    }
    videoProgress= (state)=>{
        // console.log(state.playedSeconds);
        if(!this.state.seeking){
            state.playedSeconds = Math.trunc(state.playedSeconds);
            this.setState({rawVideoTime:state.playedSeconds});
            this.setState({videoTime:helperFunctions.getFancyTime(state.playedSeconds)});
            //console.log(this.player.getCurrentTime());
        }  
    }
    videoDuration=(vidDuration)=>{
        this.setState({duration:vidDuration});
        // console.log("minutes: " + Math.floor(duration/60) + "seconds: " + Math.floor(((Math.floor(duration/60)-duration/60) * 60)*-1)); 
    }
    nextVideo=()=>{
        let nextVid = this.state.vidIndex+1;
        if(nextVid < this.state.playlist.length){
            this.getNewVideo(nextVid);
        }
    }
    render(){
        const classes = styles;
        const {video, playing, volume, rawVideoTime, videoTime, duration, loop, shuffle, openQueue, pip, hoverPlayer, selected} = this.state;
        //console.log("render running")
        return(
            <div>
                <ThemeProvider theme={playerTheme}>
                    <CssBaseline/>
                    <div style= {classes.video} onMouseEnter={this.hoverOverPlayer} onMouseLeave={this.hoverOutPlayer}>
                        <ReactPlayer 
                            // config={{file:{attributes:{autopictureinpicture:true}}}}
                            // onContextMenu={e=>e.preventDefault()}
                            ref={this.ref}
                            url = {video}
                            key= {video}
                            playing={playing}
                            volume={volume}
                            loop={loop}
                            pip={pip}
                            width= {pipWidth}
                            height= {pipHeight}
                            onDisablePIP = {this.pipDisable}
                            onReady={this.playerReady}
                            onProgress={this.videoProgress}
                            onDuration={this.videoDuration}
                            onEnded={this.nextVideo}
                        />        
                        <IconButton disabled = {hoverPlayer} style={classes.overlapPIPVideo} onClick = {this.pip} color="secondary">
                            {
                                pip===true ?
                                    <PictureInPictureAltIcon/>
                                :
                                    <PictureInPictureIcon/>
                            }
                        </IconButton>  
                    </div>                      

                    <Drawer 
                        variant = "permanent" 
                        anchor="bottom"
                        style={{height:"200px"}}
                    >
                        <div style={classes.playerBarContainer}>
                            <div style={classes.vidInfoContainer}>
                                <div style={classes.vidImageContainer}>
                                    {
                                        fileType === "mp3" ?
                                        <div>
                                            <MusicNoteIcon style={classes.vidImage} fontSize="large"/>
                                        </div>
                                        :
                                        <div>
                                            <MovieIcon style={classes.vidImage} fontSize="large"/>
                                        </div>
                                    }
                                </div>
                                {/* 15 characters limit */}
                                <div style={{color:"#00adb5", marginLeft:"10px", overflow:"hidden",whiteSpace:"nowrap",width:"100%"}}>{vidTitle}</div>
                            </div>
                                <div style = {classes.playPauseIconContainer}>
                                    <IconButton style={classes.playerIcons} onClick={this.shuffle}color = "secondary">
                                        {
                                            !shuffle ? 
                                                <ShuffleIcon/>
                                            :
                                                <ShuffleIcon style={classes.iconClicked}/>
                                        }
                                    </IconButton>
                                    <IconButton onClick = {this.rewind} color = "secondary">
                                        <FastRewindIcon fontSize="large"/>
                                    </IconButton>
                                    <IconButton onClick={this.play} style={classes.playPauseButton} color = "secondary" >
                                        {
                                            playing ?
                                                <PauseIcon style={classes.playPauseIcon} fontSize="large"/>
                                            :
                                                <PlayArrowIcon style={classes.playPauseIcon}  fontSize="large"/>
                                        }
                                    </IconButton>
                                    <IconButton onClick = {this.nextVideo} color = "secondary">
                                        <FastForwardIcon fontSize="large"/>
                                    </IconButton>
                                    <IconButton style={classes.playerIcons} onClick={this.loop} color = "secondary">
                                        {
                                            !loop ? 
                                                <LoopIcon/>
                                            :
                                                <LoopIcon style={classes.iconClicked}/>
                                        }
                                    </IconButton>
                                </div>
                                <IconButton style={{marginBottom:"7px",marginRight:"3px"}} onClick={this.queue} color = "secondary">
                                    <QueueMusicIcon/>
                                </IconButton>
                                <Dialog
                                    fullScreen
                                    TransitionComponent={Transition}
                                    open={openQueue}
                                    onClose={this.closeQueue}
                                >
                                    <IconButton
                                        edge="start"
                                        color="inherit"
                                        onClick={this.closeQueue}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                    <List sx = {{
                                        display:'flex',
                                        flexDirection:"column", 
                                        padding:"0", 
                                        height: "100%",
                                        overflow: "auto",     
                                        '&::-webkit-scrollbar': {
                                            width: '10px',
                                            height: '10px', 
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor:"#00adb5"
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor:"#007d85",
                                        }}}>
                                        {this.state.playlist.map((data,index) => (
                                            <div style ={classes.playlistListContainer}>
                                                <ListItemButton 
                                                    style={{width:"100%",paddingRight:0}} 
                                                    color="primary"  
                                                    selected = {false}
                                                    onClick = {(()=>{this.getNewVideo(index)})}
                                                    key={index}
                                                >
                                                    <div style= {{display:"flex",width:"70%",position:"absolute"}}>
                                                        <ListItemIcon style={{marginTop:"3px",position:"relative",left:"15px"}}>
                                                        {
                                                            selected === this.state.playlist[index][0] ? 
                                                                <PlayArrowIcon style={{fontSize:"25px", color:"#4dadb5"}}/>
                                                            :
                                                                data[0].slice(data[0].length-3) === "mp3" ?
                                                                    <MusicNoteRoundedIcon/>
                                                                :
                                                                    <MovieIcon style={{fontSize:"25px"}}/>
                                                        }     
                                                        </ListItemIcon>
                                                        {
                                                            selected === this.state.playlist[index][0] ? 
                                                                <ListItemText 
                                                                    style={{color:"#4dadb5", width:"500px", textOverflow: "ellipsis",whiteSpace:"nowrap",overflow:"hidden"}}
                                                                    primary={data[0].substring(0,data[0].length-4)}
                                                                />
                                                            :
                                                            <ListItemText 
                                                                style={{width:"100%", textOverflow: "ellipsis",width:"500px", whiteSpace:"nowrap",overflow:"hidden"}}
                                                                primary={data[0].substring(0,data[0].length-4)}
                                                            />
                                                        }
                                                    </div>
                                                    </ListItemButton>
                                                    <div style={{display:"flex",alignItems:"flex-end", marginBottom:"10px",marginTop:"10px",marginRight:"10px"}}>    
                                                        <p style={{color:"#007d85", marginBottom:"auto",marginTop:"auto"}}>{helperFunctions.getFancyTime(this.state.playlist[index][1])}</p>
                                                    </div>
                                            </div>
                                        ))}
                                    </List>
                                </Dialog>
                                    <Grid style={classes.volumeBar} container spacing={2} >
                                        <Grid item>
                                            <VolumeDown style ={{marginTop:"3px"}} color = "secondary"/>
                                        </Grid>
                                        <Grid item xs>
                                        <Slider 
                                            aria-labelledby="continuous-slider"
                                            onChange= {(event,value)=>{this.changeVolume(event,value)}}
                                            value={volume*500}
                                        />
                                        </Grid>
                                    <Grid item>
                                        <VolumeUp style ={{marginTop:"3px"}} color = "secondary"/>
                                    </Grid>
                                </Grid>
                            </div>
                        <Grid style={{width:"60%",marginLeft:"auto",marginRight:"auto",marginBottom:"5px"}} container spacing={2} >
                            <Grid item>
                                <p style= {classes.timeSliderText}>{videoTime}</p>
                            </Grid>
                            <Grid item xs>
                                <Slider
                                    min={0}
                                    max= {duration}
                                    value={rawVideoTime}
                                    onChange={(event,value)=>{this.setState({rawVideoTime:value});this.setState({videoTime:helperFunctions.getFancyTime(value)});}}
                                    onMouseDown={(event)=>{
                                        this.setState({seeking:true});
                                        this.setState({playing:false});
                                        let self = this;
                                        window.addEventListener("mouseup", function handleMouseDown(){
                                            self.setState({seeking:false});
                                            self.setState({playing:true});
                                            self.player.seekTo(Math.floor(self.state.rawVideoTime));
                                            window.removeEventListener("mouseup", handleMouseDown);
                                          });
                                    }}
                                    aria-labelledby="continuous-slider" 
                                />
                            </Grid>
                            <Grid item>
                                <p style= {classes.timeSliderText}>{helperFunctions.getFancyTime(duration)}</p>
                            </Grid>
                        </Grid>
                    </Drawer>
                </ThemeProvider>
            </div>
        )
    }
}
export default Player;