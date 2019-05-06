const fs = require('fs');
const { shell, clipboard } = require('electron');
const { dialog, BrowserWindow, nativeImage } = require('electron').remote
const path = require("path")
const { exec } = require('child_process');
const robot = require('./robotjs')

dirname = __dirname;

isWin = process.platform == 'win32' ? true : false;

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

readDir = (path,callback) => {
    fs.readdir(path, (err, files) => {
        callback(err, files);
    });
}

dash = query => {
    let cmd = process.platform == 'win32' ? `start dash-plugin://query=${query}` : `open dash://${query}`
    exec(cmd, (err, stdout, stderr) => {
      err && console.log(stderr);
    });
}

copyTo = text => {
    clipboard.writeText(text)
}

paste = () => {
    var ctlKey = isWin ? 'control' : 'command';
    robot.keyTap('v', ctlKey);
}