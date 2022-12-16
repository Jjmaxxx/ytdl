import React from "react";
let restrictedFileSymbols = ['<','>',':','/',"\"",'\\','|','?','*','#'];
let restrictedFileNames = ["CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"]
let playlistMap = new Map();
const helperFunctions = {
  setOptions:function(options){
    let optionsList = [];
    for(let i=0; i<options.length;i++){
      optionsList.push(<option key ={i} value={options[i].value}>{options[i].name}</option>)
    }
    return optionsList;
  },
  getFancyTime:function(seconds){
    if(((seconds - (Math.floor(seconds/60) *60)) < 10 && seconds <60)){
      return Math.floor(seconds/60)+ ":0" +Math.floor(seconds)
    }else if(Math.floor(seconds) < 60){
      return Math.floor(seconds/60)+ ":" +Math.floor(seconds)
    }
    else if((seconds - (Math.floor(seconds/60) *60)) < 10 && seconds >59){
      return Math.floor(seconds/60)+ ":0" +Math.floor(seconds- Math.floor(seconds/60) * 60)
    }else{
      return Math.floor(seconds/60)+ ":" +Math.floor(seconds - Math.floor(seconds/60) * 60)
    }
  },
  findSong:function(songsList,currSong){
    let currSongIndex = songsList.findIndex((element)=> element[0] === currSong);
    if(currSongIndex === -1){
      currSongIndex = 0;
    }
    return currSongIndex;
  },
  changeRestrictedTitles:(vidTitle)=>{
    let newTitle = "";
    let min = 0;
    for(let i=0; i<vidTitle.length;i++){
      while(restrictedFileSymbols.includes(vidTitle[min])){
        min++;
        i=min;
      }
      if (restrictedFileSymbols.includes(vidTitle[i])){
        newTitle+= vidTitle.slice(min,i);
        min=i+=1;
      }else if(i+1 === vidTitle.length){
        newTitle+= vidTitle.slice(min,i+1);
      }
    }
    if(newTitle.length < 1){
      newTitle = "no name"
    }
    return newTitle;
  },
  detectRestrictedTitles:(vidTitle)=>{
    if(restrictedFileNames.includes(vidTitle) || vidTitle.length < 1 || vidTitle.length > 200){
      return false;
    } 
    return true;
  },
  addPlaylistToMap:(path,playlist)=>{
    playlistMap.set(path,playlist);
  },
  getPlaylistFromMap:(path)=>{
    console.log(playlistMap);
    if(playlistMap.has(path)){
      return playlistMap.get(path);
    }
    return false;
  }
}
export default helperFunctions;