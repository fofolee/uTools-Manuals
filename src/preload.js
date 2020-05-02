const { clipboard } = require('electron');
const { exec } = require('child_process');
const crypto = require('crypto')

//-------checkUpdate------
const fs = require('fs');
const path = require("path")

pluginInfo = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugin.json')));

open = url => {
    utools.shellOpenExternal(url);
}
// ------------------------

dirname = __dirname;

isWin = process.platform == 'win32' ? true : false;

openFolder = () => {
    return utools.showOpenDialog({ 
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
    let cmd = process.platform == 'win32' ? `start dash-plugin://query=${query}` : `open dash://${query}`;
    exec(cmd, (err, stdout, stderr) => {
      err && utools.showNotification(stderr, clickFeatureCode = null, silent = true);
    });
}

copyTo = text => {
    clipboard.writeText(text)
}

copy = () => {
    var ctlKey = isWin ? 'control' : 'command';
    utools.simulateKeyboardTap('c', ctlKey);
}

paste = () => {
    var ctlKey = isWin ? 'control' : 'command';
    utools.simulateKeyboardTap('v', ctlKey);
}

rc4 = (text, key) => {
    var decipher = crypto.createDecipher('rc4', key);
    var result = decipher.update(text, 'base64', 'utf8');
    result += decipher.final('utf8');
    return result
}