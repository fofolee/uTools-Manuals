const fs = require('fs')
const { shell } = require('electron');

getDirname = () => __dirname;

read = (path, callback) => {
    fs.readFile(path, 'utf8', (err, data) => {
        callback(err, data);
    })
}

open = url => {
    shell.openExternal(url);
}