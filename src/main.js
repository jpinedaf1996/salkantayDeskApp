const {app, BrowserWindow} = require('electron');
const path = require('path');
require('electron-reload')(__dirname);
const ejse = require('ejs-electron');


ejse.data({
    name: 'SALKANTAY CAFE',

})

function crearVentanaPrincipal() {
    let ventanaPrincipal = new BrowserWindow({
        width: 1080,
        height: 720,
        
    });

    ventanaPrincipal.loadFile(__dirname + '/views/index.ejs');
}

app.whenReady().then(crearVentanaPrincipal);

app.on('window-all-closed', function() {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0){
        crearVentanaPrincipal();
    }
});

