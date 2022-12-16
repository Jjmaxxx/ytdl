//import { makeStyles} from "@material-ui/core";
const styles = {
    root: {
      display: 'flex',
      height:"0px",
      width:"100%"
      // backgroundColor:'black',
    },
    appBar: {
      //zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: "300px",
      height:"50%",
      flexShrink: 0,
    },
    drawerPaper:{
      width: "300px",
    },
    drawerTabs: {
      width: "100%",
      display:"inline-block"
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      marginLeft:"180px",
      marginBottom:"161px"
    },
    contentContainer: {
      flexGrow: 1,
      height:"100%",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection:"column",
      //padding: theme.spacing(3),
    },
    contentInputCenter:{
      display: 'flex',
      alignItems: 'center',
      flexDirection:"column",
    },
    contentCenter:{
      display:"flex",
      alignItems:'center',
    },
    break: {
      flexBasis:"100%",
      width:0
    },
    iconClicked:{
      color:"#5cdfe7"
    }, 
    playPauseButton:{
      backgroundColor:"#00adb5", 
      width:"55px", 
      height:"55px"
    },
    playPauseIcon:{
      color:"#000000", 
      marginTop:"5px"
    },
    playerBarContainer:{
      height:"110px",
      display:"flex", 
      alignItems:"center",
      overflow:"hidden"
      // justifyContent:"space-between",
    },
    playerBar:{
      // marginLeft:"auto",
      // paddingLeft:"205px"
    },
    playPauseIconContainer:{
      display:"flex",
      justifyContent:"center",
      alignItems:"center", 
      width:"100%",
      overflow:"hidden"
    },
    playlistListContainer:{
      display:"flex", 
      width:"100%", 
      backgroundColor:"#0d1217",
    },
    playlistContainer:{
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
    },
    playerIcons:{
      marginTop:"5px",
      overflow:"hidden"
    },
    timeSliderText:{
      color:"#00adb5",
      marginTop:"3px"
    },
    toolbar:{
      WebkitAppRegion:"drag",
      backgroundColor:"#012d33",
      width:"100%", 
      minHeight:"25px",
      maxHeight:"25px", 
      display:"flex",
      justifyContent:"flex-end",
      padding:"0"
    },
    title:{
      color:"#007d85",
      fontWeight:"bold", 
      fontFamily:"helvetica",
      fontSize:"12px",
      marginRight:"auto",
      marginLeft:"8px"
    },
    titleButtons:{
      WebkitAppRegion:"no-drag",
      borderRadius: 0
    },
    volumeBar:{
      width:"400px",
      marginRight:"10px",
      // marginLeft:"auto"
    },
    video: {
      margin: 0,
      right: 1,
      bottom: 170,
      left: 'auto',
      position: 'fixed',
      zIndex:1,
    },
    overlapPIPVideo:{
      position:"absolute",
      zIndex:2,
      bottom:'35px',
      left:'20px',
      backgroundColor:'rgba(0,0,0,0.6)',
    },
    vidImage:{
      color:"#000000",
      marginTop:"3px",
    },
    vidInfoContainer:{
      display:"flex",
      alignItems:"center", 
      width:"400px",
      marginLeft:"5px",
      overflow:"hidden"
    },
    vidImageContainer:{
      backgroundColor:"#00adb5", 
      minWidth:"40px",
      minHeight:"40px", 
      maxHeight:"40px",
      maxWidth:"40px",
      marginLeft:"18px", 
      display:"flex", 
      justifyContent:"center",
      alignItems:"center",
    },
    playlistHeading:{
      backgroundColor:"#0d1217", 
      color:"white", 
      width:"100%",
      height:"200px",
      display: 'flex',
      alignItems: 'center'
    },
    playlistImageContainer:{
      marginLeft:"250px", 
      display:"flex",
      width:"100%"
    },
    playlistImage:{
      width:"110px", 
      height:"110px",
      backgroundColor:"#00adb5",
      marginRight:"20px"
    },
    playlistTitleContainer:{
      display:"flex", 
      flexDirection:"column", 
      justifyContent:"flex-end",
      width:"100%"
    },
    playlistTitle:{
      fontWeight:"bolder", 
      fontSize:"50px", 
      color:"#00adb5", 
      marginLeft:"10px"
    },
    playlistDescription:{
      fontSize:"15px", 
      color:"#00adb5", 
      marginLeft:"10px"
    },
    playlistMore:{
      right:"10px",
      top:"145px",
      position:'absolute'
    }
};
export default styles;