// 默认手册
getDefaultFeatures = () => {
    return {
        "linux": {
            "code": "linux",
            "explain": "linux命令大全",
            "cmds": ["linux命令"],
            "icon": "logo/linux.png"
        },
        "php": {
            "code": "php",
            "explain": "官方php函数文档",
            "cmds": ["php函数"],
            "icon": "logo/php.png"
        },
        "python": {
            "code": "python",
            "explain": "官方python标准库及常用第三方库文档",
            "cmds": ["python库"],
            "icon": "logo/python.png"
        },
        "c": {
            "code": "c",
            "explain": "C语言函数速查",
            "cmds": ["C函数"],
            "icon": "logo/c.png"
        },
        "vim": {
            "code": "vim",
            "explain": "vim命令大全",
            "cmds": ["vim命令"],
            "icon": "logo/vim.png"
        },
        "git": {
            "code": "git",
            "explain": "git命令概览",
            "cmds": ["git命令"],
            "icon": "logo/git.png"
        },
        "docker": {
            "code": "docker",
            "explain": "docker常用命令",
            "cmds": ["docker命令"],
            "icon": "logo/docker.png"
        },
        "sql": {
            "code": "sql",
            "explain": "sql操作手册",
            "cmds": ["sql手册"],
            "icon": "logo/sql.png"
        },
        "utools": {
            "code": "utools",
            "explain": "uTools的API文档",
            "cmds": ["uToolsAPI"],
            "icon": "logo/utools.png"
        }
    };
}

// 配置页面
showOptions = () => {
    $("#options").show();
    const dFeatures = getDefaultFeatures();
    var cFeatures = utools.getFeatures();
    let featureList = '<table><tr><td></td><td>关键字</td><td>说明</td><td>启用</td><td>主输入框搜索</td></tr>';
    for (var f in dFeatures) {
        var cmds = '';
        dFeatures[f].cmds.forEach(cmd => {
            if (typeof (cmd) == "string") cmds += `<span class="keyword">${cmd}</span>`;
        });
        var isChecked1 = '';
        var isChecked2 = '';
        var isDisabled = 'disabled';
        for(var c of cFeatures){
            if (c.code == dFeatures[f].code) {
                isChecked1 = 'checked';
                isDisabled = '';
                if (typeof(c.cmds[c.cmds.length - 1]) != 'string') isChecked2 = 'checked';
                break;
            }
        }
        featureList += `<tr><td><img src="logo/${dFeatures[f].code}.png"></td>
        <td>${cmds}</td><td>${dFeatures[f].explain}</td><td>
        <label class="switch-btn">
        <input class="checked-switch" id="${dFeatures[f].code}_1" type="checkbox" ${isChecked1}>
        <span class="text-switch"></span>
        <span class="toggle-btn"></span>
        </label></td><td>
        <label class="switch-btn">
        <input class="checked-switch" id="${dFeatures[f].code}_2" type="checkbox" ${isDisabled} ${isChecked2}>
        <span class="text-switch"></span>
        <span class="toggle-btn"></span>
        </label></td>`
    };
    featureList += '</tr></table>'
    $("#options").html(featureList);
}

// 监听开关
$("#options").on('change', 'input[type=checkbox]', function () {
    const dFeatures = getDefaultFeatures();
    var id = $(this).attr('id').split('_');
    var code = id[0]
    if (id[1] == '1') {
        if (!utools.removeFeature(code)) {
            utools.setFeature(dFeatures[code]);
            $(`#${code}_2`).prop('disabled', false);
        } else {
            $(`#${code}_2`).prop('checked', false);
            $(`#${code}_2`).prop('disabled', true);
        }
    } else {
        var featureConf = dFeatures[code];
        if($(this).prop('checked')){
            featureConf.cmds.push({
                "type": "over",
                "label": featureConf.cmds[0],
                "maxLength": 50
            });
        }
        utools.setFeature(featureConf);
    }
});