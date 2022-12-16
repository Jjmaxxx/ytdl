const path = require('path');
const fs = require("fs");
const ytdl = require("ytdl-core");
const ffmpeg = require('ffmpeg-static');
const cp = require('child_process');
const { contextIsolated } = require("process");

let vidInfo;
let downloadedChunks=0;
module.exports = {
  createReadableStream: (link)=>{
    return new Promise(resolve=>{
      let getName = async()=> await ytdl.getInfo(link);
      getName().then((info)=>{
        //console.log(info);
        let defaultName = info.videoDetails.title;
        let uniqueQuality = new Map();
        let qualities = [];
        info.formats.forEach((element)=>{
          let elementQuality = element.qualityLabel;
          if(element.container == "mp4" && element.hasVideo == true && element.hasAudio == false && !uniqueQuality.has(elementQuality)){
            uniqueQuality.set(elementQuality, elementQuality)
            qualities.push({name:elementQuality, value: element.itag})
          }
        });
        //console.log(qualities);
        vidInfo = info;
        resolve({name:defaultName, qualityList:qualities});
    });
    })  
  },
  audioOnly: (args)=>{
    // let path = "./src/react/videos/"+vid.name +".mp3";
    let vidPath = path.join(__dirname,"videos/downloads/"+args.vid.name +".mp3").replace('app.asar','app.asar.unpacked');
    return new Promise(resolve=>{
      ytdl(args.vid.url,{filter:"audioonly"}).on('progress',(_,totalDownloaded,total)=>{
        downloadedChunks++;
        if(downloadedChunks%30==0){
          // console.log(args.vid.name + ": " +(totalDownloaded/total)*100 + "%");
          args.win.webContents.send('loadingBar',{name: args.vid.name + ": ", progress: Math.floor((totalDownloaded/total)*100),folder:vidPath});
        }
      }).pipe(fs.createWriteStream(vidPath)).on('finish',()=>{
        downloadedChunks = 0;
        args.win.webContents.send('loadingBar',{name: args.vid.name + ": ", progress: 100,folder:vidPath});
        resolve(vidPath);
      })
    })
  },
  mergeVideoAudio: (args)=>{
    let vidPath = path.join(__dirname,"videos/downloads/"+args.vid.name +".mp4").replace('app.asar','app.asar.unpacked');
    let videoDownloaded = {
      audio:{downloaded:0, total:0},
      video:{downloaded:0, total:0},
    }
    const audio = ytdl(args.vid.url,{quality:"highestaudio"}).on('progress',(_,totalDownloaded,total)=>{
      videoDownloaded.audio = {downloaded: totalDownloaded, total: total,folder:vidPath}
    });
    const video = ytdl(args.vid.url, { quality: args.vid.quality}).on('progress',(_,totalDownloaded,total)=>{
      videoDownloaded.video = {downloaded: totalDownloaded, total: total,folder:vidPath}
    });;
    return new Promise(resolve=>{
      const ffmpegProcess = cp.spawn(ffmpeg, [
        // Remove ffmpeg's console spamming
        '-loglevel', '8', '-hide_banner',
        // Redirect/Enable progress messages
        '-progress', 'pipe:3',
        // Set inputs
        '-i', 'pipe:4',
        '-i', 'pipe:5',
        // Map audio & video from streams
        '-map', '0:a',
        '-map', '1:v',
        // Keep encoding
        '-c:v', 'copy',
        // Define output file
        vidPath,
      ], {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          'inherit', 'inherit', 'inherit',
          /* Custom: pipe:3, pipe:4, pipe:5 */
          'pipe', 'pipe', 'pipe',
        ],
      });
      //https://github.com/fent/node-ytdl-core/blob/HEAD/example/ffmpeg.js
      ffmpegProcess.stdio[3].on('data', chunk => {
        let totalDownloaded = Math.floor((((videoDownloaded.audio.downloaded/videoDownloaded.audio.total)*100)+(videoDownloaded.video.downloaded/videoDownloaded.video.total)*100)/2);
        // console.log("totalDownloaded: " + totalDownloaded + "%");
        // console.log(args.vid.name)
        args.win.webContents.send('loadingBar',{name: args.vid.name + ": ", progress: totalDownloaded});
        // console.log("audio: " + (videoDownloaded.audio.downloaded/videoDownloaded.audio.total)*100 + "%");
        // console.log('video: ' + (videoDownloaded.video.downloaded/videoDownloaded.video.total)*100 + "%");
      })
      ffmpegProcess.on('close', () => {
        // process.stdout.write('finished')
        args.win.webContents.send('loadingBar',{name: args.vid.name + ": ", progress: 100});
        resolve(vidPath);
      })
      audio.pipe(ffmpegProcess.stdio[4]);
      video.pipe(ffmpegProcess.stdio[5]);
    })
  }
}
