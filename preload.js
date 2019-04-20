const fs = require('fs');
const os = require('os');
const { spawn } = require("child_process")
const { shell } = require('electron');
const { dialog } = require('electron').remote
const { BrowserWindow } = require('electron').remote

getDirname = () => __dirname;

open = url => {
    shell.openExternal(url);
}

openFolder = () => {
    return dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
        buttonLabel: '选择',
        properties: ['openDirectory']
    });
}

messageBox = (options, callback) => {
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options, index => {
        callback(index);
    })    
}

exists = path => {
    return fs.existsSync(path);
}

sqlite2Json = (input, output) => {
    var binPath;
    if (os.platform() == 'win32') {
        binPath = `${__dirname.replace(/(.*?\.asar)/, "$1.unpacked")}/bin/sqlite3.exe`;
    } else {
        binPath = `${__dirname.replace(/(.*?\.asar)/, "$1.unpacked")}/bin/sqlite3`
    }
    const sql = spawn(binPath, [input, "select * from searchIndex", '-header', '-separator', '|||'])
    let chunks = [];
    sql.stdout.on('data', chunk => {
        chunks.push(chunk)
    })
    sql.on('close', code => {
        let stdout = chunks.join("").split('\n'),
            header = stdout[0].split('|||'),
            json = [],
            dict;
        stdout.shift();
        for (var d of stdout) {
            if (d) {
                d = d.split('|||');
                dict = {}
                for (var n = 1; n < d.length; n++) {
                    dict[header[n].trim()] = d[n].trim()
                }
                json.push(dict);
            }
        }
        fs.writeFile(output, JSON.stringify(json), 'utf8', err => {
            err && console.log(err);
        })
    })
}

xml2Json = (input, output) => {
    fs.readFile(input, 'utf8', (err, data) => {
        data = data.replace(/\"/g, "&quot;");
        data = data.replace(/<Token>.*?<Name>(.*?)<\/Name><Type>(.*?)<\/Type>.*?<Path>(.*?&gt;)*(.*?)<\/Path>\s+.*?<\/Token>/g, `{"name":"$1","type":"$2","path":"$4"},`);
        data = data.replace(/<\?xml.*?>\s+<Tokens.*?>([\s|\S]*?),\s+<\/Tokens>/, '[$1]');
        fs.writeFile(output, data, 'utf8', err => {
            err && console.log(err);
        })
    })
}