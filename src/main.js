const { app, BrowserWindow, dialog, contentTracing } = require('electron');
require('electron-reload')(__dirname);
const ejse = require('ejs-electron');


ejse.data({
    name: 'SALKANTAY CAFE',
    

});

let mainWindow;

const creteWindow = () => {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 720,
    
    });

    mainWindow.loadFile(__dirname + '/views/index.ejs');

    mainWindow.on('closed', function () {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

app.on('ready', creteWindow);





