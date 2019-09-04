const { clipboard } = require('electron');
const { exec } = require('child_process');
const robot = utools.robot

//-------checkUpdate------
const fs = require('fs');
const path = require("path")
const { dialog, BrowserWindow, nativeImage } = require('electron').remote
const { shell } = require('electron');

pluginInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugin.json')));
logo = nativeImage.createFromPath(path.join(__dirname, 'logo.png'));

messageBox = (options, callback) => {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options, index => {
        callback(index);
    })
}

open = url => {
    shell.openExternal(url);
}
// ------------------------

dirname = __dirname;

isWin = process.platform == 'win32' ? true : false;

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

copy = () => {
    var ctlKey = isWin ? 'control' : 'command';
    robot.keyTap('c', ctlKey);
}

paste = () => {
    var ctlKey = isWin ? 'control' : 'command';
    robot.keyTap('v', ctlKey);
}