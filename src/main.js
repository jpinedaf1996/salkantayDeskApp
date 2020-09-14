const {app,BrowserWindow}=require('electron');
require('electron-reload')(__dirname);
const ejse = require('ejs-electron');

ejse.data({name : 'SALKANTAY CAFE'});

let mainWindow = null;

app.on('ready',()=>{
    mainWindow =  new BrowserWindow({
        width:1200,
        height:720
    })
    mainWindow.loadFile(__dirname + '/views/index.ejs')
});