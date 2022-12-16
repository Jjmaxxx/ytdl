import React from "react";
class VideoText extends React.Component{
  render(){
    console.log(this.props.text);
    return <p>{this.props.text}</p>
  }
}
export default VideoText;