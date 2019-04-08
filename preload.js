const fs = require('fs')
const { shell } = require('electron');

read = (path, callback) => {
    fs.readFile(`${__dirname}/${path}`, 'utf8', (err, data) => {
        callback(err, data);
    })
}

open = url => {
    shell.openExternal(url);
}