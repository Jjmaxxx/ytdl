const { ipcRenderer } = require('electron');
ipcRenderer.on("asynchronous-message",(event,message)=>{
    
    console.log('aaa');

    //document.getelementbyid src file
})

// //npm install electron-reload

