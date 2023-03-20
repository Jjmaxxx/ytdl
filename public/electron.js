const path = require('path');
const fs = require('fs-extra')
const {ipcRenderer, ipcMain, app, BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const ytdl = require("./ytdl.js");
let win, downloadFolder;
let directory = __dirname.replace('app.asar','app.asar.unpacked');
const { getAudioDurationInSeconds } = require('get-audio-duration');
// require(directory.replace('build','node_modules')+"/get-audio-duration/dist/commonjs/index.js")

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 1000,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#000000',
    //   symbolColor: '#007d85'
    // },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  win.webContents.send("asynchronous-message",{});
}
app.whenReady().then(()=>{
  createWindow();
  app.on("activate",()=>{
      if(BrowserWindow.getAllWindows().length == 0){
          createWindow();
      }
  })
})
ipcMain.on('minimize',()=>{
  win.minimize()
})
ipcMain.on('close',()=>{
  win.close()
})
ipcMain.on('getCurrFolder',(event)=>{
  console.log(directory);
  console.log(app.getAppPath());
  event.reply("currFolder",directory);
})
ipcMain.on('openFolders', (event,folderPath)=>{
  openFolder = path.join(directory,folderPath);
  require('child_process').exec(`start "" "${openFolder}"`);
})
ipcMain.on('getFolders', async(event,folderPath)=>{
  downloadFolder = path.join(directory,folderPath);
  let folders = [];
  let findPath = async ()=>{
    fs.readdirSync(downloadFolder).forEach(file =>{
      folders.push(file);
    });
  }
  await findPath();
  event.reply('gotFolders', folders);
})
ipcMain.on("getFiles", (event, data)=>{
  data.path = path.join(downloadFolder, data.path);
  event.reply("currFolder", data.path);
  let files = [];
  let folderFiles = fs.readdirSync(data.path);
  // console.log(folderFiles)
  if(!folderFiles.length){
    // console.log("no files")
    event.reply('gotFiles', null);
  }
  else if(data.getPlaylistFromMap !== false && data.getPlaylistFromMap.length == folderFiles.length){
    event.reply('gotFiles',data.getPlaylistFromMap);
  }
  else{
    folderFiles.forEach((file) =>{
      //index doesnt work because it will keep adding before getaudioduration is fully done
      let filePath = path.join(data.path,file);
      event.reply("currFolder", filePath);
      getAudioDurationInSeconds(filePath).then((duration) => {
        files.push([file,duration,fs.statSync(filePath).birthtimeMs]);
        event.reply('gotFiles', files);
        // if(num === array.length){
        //   resolve(files);
        // }
      }).catch((err)=>{
        event.reply("currFolder", err);
      }); 
    });
  }
  // getFiles.then((data)=>{
  //   let sortFiles = new Promise(resolve=>{
  //     resolve(
  //       data.sort((a,b)=>{
  //         return(b[2] - a[2]);
  //       })
  //     )
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  //   sortFiles.then((data)=>{
  //     // console.log(data);
  //     event.reply('gotFiles', data);
  //   })
  //   //console.log(data);
  // })
  // console.log(files)
  // event.reply('gotFiles', files);
})
ipcMain.on('sent-link', async(event, arg)=>{
  let videoData = await ytdl.createReadableStream(arg);
  event.reply('vid-info', videoData);
})
ipcMain.on('createFolder', (event, folderName)=>{
  let folder = path.join(downloadFolder,folderName);
  fs.ensureDirSync(folder);
  win.webContents.send('newFolder',(folderName));
})
ipcMain.on('download', async(event,args)=>{
  let done;
  if(args.fileType === "mp3"){
    done = await ytdl.audioOnly({vid:args, win:win});
  }
  else{
    done = await ytdl.mergeVideoAudio({vid:args, win:win});
  }
  console.log('a')
  //event.reply('')
})
ipcMain.on('moveFile', async(event, args)=>{
  let filePath = path.join(downloadFolder,args.fileFolder);
  filePath= path.join(filePath, args.file[0]);
  let targetFolder = path.join(downloadFolder, args.targetFolder);
  targetFolder = path.join(targetFolder,args.file[0]);
  // console.log("targetFolder: "+ targetFolder);
  // console.log("filePath: " + filePath);
  fs.rename(filePath, targetFolder, (err)=> {
    if (err) throw err;
    event.reply('fileMoved',args.file);
  })
})
ipcMain.on('renameFile', async(event, args)=>{
  let filePath = path.join(downloadFolder,args.fileFolder);
  // console.log(path.join(filePath,args.file[0]));
  // console.log(path.join(filePath,args.newName))
  fs.rename(path.join(filePath,args.file[0]), path.join(filePath,args.newName) +  ".mp3", (err)=> {
    if (err) throw err;
    // console.log('renamed');
    event.reply('fileRenamed',{prevName:args.file, newName:args.newName});
  })
})
ipcMain.on('deleteFile', async(event, args)=>{
  // console.log(args);
  let file = path.join(downloadFolder,args.path);
  file= path.join(file, args.file);
  // console.log(file);
  fs.unlink(file, function(err) {
    if(err && err.code == 'ENOENT') {
      console.info("file doesn't exist");
    }else if(err) {
      console.error("error when trying to remove file");
    }else {
      console.info('removed');
      event.reply('deletedFile',args.file);
    }
  }); 
})
ipcMain.on('deleteFolder', async(event, folderPath)=>{
  // console.log(args);
  let folder = path.join(downloadFolder,folderPath);
  // console.log(file);
  fs.remove(folder,()=>{
    console.log("deleted " +folder);
    win.webContents.send('folderDeleted');
  }); 
})
// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

module.exports.ipcRenderer = ipcRenderer;