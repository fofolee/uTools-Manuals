const fs = require('fs');
const { shell } = require('electron');
const { dialog, BrowserWindow, nativeImage } = require('electron').remote
const path = require("path")

dirname = __dirname;

open = url => {
    shell.openExternal(url);
}

openFolder = () => {
    return dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        buttonLabel: '选择',
        properties: ['openDirectory']
    });
}

readFile = file => 
    new Promise((reslove, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) reject(err);
            reslove(data);
        });
    });

getLogo = () => nativeImage.createFromPath(path.join(__dirname, 'logo.png'));

messageBox = (options, callback) => {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options, index => {
        callback(index);
    })    
}

exists = path => {
    return fs.existsSync(path);
}