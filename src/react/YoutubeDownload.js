import React from "react";
import styles from './utils/styles.js';
import { Button, TextField } from "@mui/material";
import Alert from '@mui/material/Alert';
import helperFunctions from './utils/helperFunctions.js';

const { ipcRenderer } = window.require("electron");
let qualities,link;
let selections = new Map();
class YoutubeDownload extends React.Component{
    constructor(props){
        super(props);
        this.titleRef = React.createRef();
        this.linkSubmit = this.linkSubmit.bind(this);
        this.changeOption = this.changeOption.bind(this);
        this.download = this.download.bind(this);
        this.getName = this.getName.bind(this);
        this.state = {
            linkSubmitted:false, 
            fileName:"", 
            fileType:"mp3",
            titleError:"false",
            inputWidth:""
        };
    }
    changeOption= (event,args)=>{
        selections.set(args,event.target.value);
        if(args === "mp3ormp4"){
            this.setState({fileType:event.target.value});
        }
    }
    download=(event)=>{
        event.preventDefault();
        if(!helperFunctions.detectRestrictedTitles(this.state.fileName)){
            console.log('Something is wrong with title');
            this.setState({titleError:true});
        }else{
            this.props.downloadVideo({fileType:selections.get('mp3ormp4'), name: this.state.fileName, url: link, quality:selections.get('quality')});
            window.location.reload(true);
            //ipcRenderer.send('download', {fileType:selections.get('mp3ormp4'), name: this.state.fileName, url: link, quality:selections.get('quality')});
            // console.log(selections.get('quality'));
            // console.log(selections.get('mp3ormp4'));
        }
    }
    getName=(event)=>{
        this.setState({fileName:event.target.value},()=>{
            this.changeInputWidth();
        });
    }
    changeInputWidth=()=>{
        this.titleRef.current.innerHTML = this.state.fileName;
        this.setState({inputWidth:this.titleRef.current.getBoundingClientRect().width + 30},()=>{
            console.log(this.state.inputWidth)
        })
    }
    linkSubmit = (event) => {
        event.preventDefault();
        this.setState({titleError:"false"});
        link=event.target[0].value;
        ipcRenderer.send('sent-link', link);
        ipcRenderer.on('vid-info', (event, vid) => {
            this.setState({fileName:helperFunctions.changeRestrictedTitles(vid.name)},()=>{
                this.changeInputWidth();
            });
            //this.setState({fileName:vid.name});
            qualities = vid.qualityList;
            selections.set("quality", vid.qualityList[0].value);
            selections.set("mp3ormp4", "mp3");
            this.setState({linkSubmitted:true});
        })
    }
    render(){
        const classes = styles;
        return(
            <div style={classes.contentContainer}>
                <div style={classes.content}>
                    <div style={classes.contentInputCenter}>
                        <form onSubmit={this.linkSubmit}>
                            {/* <label htmlFor="youtubeForm">Insert youtube url:</label> */}
                            <TextField id="standard-basic" color ="secondary" label="Insert Youtube URL" />
                            <Button style={{top:"12px",left:"5px"}}variant="contained" color="primary" type="submit">Submit</Button>
                        </form>
                    </div>
                        {(()=>{
                        if(this.state.linkSubmitted === true ){
                            return(
                            <div>
                                <div style={classes.contentInputCenter}>
                                <TextField
                                    label="Title"
                                    id="outlined-size-small"
                                    defaultValue="Small"
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    value={this.state.fileName} 
                                    style={{top:"10px", minWidth:"60px", maxWidth:"500px", width: this.state.inputWidth}}
                                    onChange = {this.getName}
                                />
                                {
                                    this.state.titleError === true ?
                                        <div style= {{display:"flex",justifyContent:"center", alignItems:"center",flexDirection:"column"}}>
                                            <Alert color="primary" severity="error" variant="filled" style={{color:"white", backgroundColor:"red", textAlign:'center', marginTop:"20px"}}>There's an error with the title, fix it!</Alert>
                                            {/* //'<','>',':','/',"\"",'\\','|','?','*' */}
                                           {/* <div style={{color:"red"}}>Symbols(&lt;, &gt;, :, /, ", \, |, ?, *) are not allowed. Other special names are also not allowed (e.g. CON)</div>*/}
                                        </div>
                                    :
                                        <div/>
                                }     
                                <div style={classes.contentCenter}>
                                    {/* change these to selects instead */}
                                    <TextField
                                    label="FileType"
                                    //style={{width: `${(8*this.state.fileType.length) + 100}px`, top:"20px"}}
                                    style={{minWidth:10, top:"20px"}}
                                    id="outlined-select-currency-native"
                                    select
                                    color="secondary"
                                    onChange= {(e)=>{this.changeOption(e,"mp3ormp4")}}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    size="small"
                                    // helperText="Select Type"
                                    variant="outlined"
                                    sx={{backgroundColor:"black"}}
                                    >
                                    {helperFunctions.setOptions([{name:"mp3",value:"mp3"},{name:"mp4",value:"mp4"}])}
                                    </TextField>
                                    {this.state.fileType==="mp4" &&
                                        <TextField
                                            label="Quality"
                                            style={{minWidth:10, top:"20px"}}
                                            id="outlined-select-currency-native"
                                            select
                                            color="secondary"
                                            onChange= {(e)=>{this.changeOption(e,"quality")}}
                                            SelectProps={{
                                                native: true,
                                            }}
                                            size="small"
                                            // helperText="Select Type"
                                            variant="outlined"
                                        >
                                            {helperFunctions.setOptions(qualities)}
                                        </TextField> 
                                    }
                                    {/* <Dropdown options={[]}/>
                                    <Dropdown options={qualities}/> */}
                                    <Button style={{top:"18px",left:"4px"}}onClick={this.download} variant="contained" color="primary">Done</Button>
                                </div>
                            </div>
                        </div>
                        )
                    }
                    })()}      
                </div> 
                <span ref={this.titleRef} style={{visibility:"hidden",whiteSpace:"pre", fontSize:"16px",fontFamily:"Roboto", fontWeight:"400"}}></span>
            </div>
        )
    }
}
export default YoutubeDownload;
