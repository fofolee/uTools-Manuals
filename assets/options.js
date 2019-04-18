// 默认和自定义手册
getAllFeatures = () => {
    var defaultFts = {
        "linux": {
            features: {
                "code": "linux",
                "explain": "linux命令大全",
                "cmds": ["linux命令"],
                "icon": "logo/linux.png"    
            },
            type: "default"
        },
        "php": {
            features: {
                "code": "php",
                "explain": "官方php函数文档",
                "cmds": ["php函数"],
                "icon": "logo/php.png"
            },
            type: "default"
        },
        "python": {
            features: {
                "code": "python",
                "explain": "官方python标准库及常用第三方库文档",
                "cmds": ["python库"],
                "icon": "logo/python.png"
            },
            type: "default"
        },
        "java": {
            features: {
                "code": "java",
                "explain": "java中文文档",
                "cmds": ["java文档"],
                "icon": "logo/java.png"
            },
            type: "default"
        },
        "c": {
            features: {
                "code": "c",
                "explain": "C语言函数速查",
                "cmds": ["C函数"],
                "icon": "logo/c.png"
            },
            type: "default"
        },
        "javascript": {
            features: {
                "code": "javascript",
                "explain": "MDN javascript中文文档",
                "cmds": ["js文档"],
                "icon": "logo/javascript.png"
            },
            type: "default"
        },
        "jQuery": {
            features: {
                "code": "jQuery",
                "explain": "jQuery官方中文文档",
                "cmds": ["jQuery文档"],
                "icon": "logo/jQuery.png"
            },
            type: "default"
        },
        "vue": {
            features: {
                "code": "vue",
                "explain": "vue官方中文API文档",
                "cmds": ["vue文档"],
                "icon": "logo/vue.png"
            },
            type: "default"
        },
        "vim": {
            features: {
                "code": "vim",
                "explain": "vim命令大全",
                "cmds": ["vim命令"],
                "icon": "logo/vim.png"
            },
            type: "default"
        },
        "git": {
            features: {
                "code": "git",
                "explain": "git命令概览",
                "cmds": ["git命令"],
                "icon": "logo/git.png"
            },
            type: "default"
        },
        "docker": {
            features: {
                "code": "docker",
                "explain": "docker常用命令",
                "cmds": ["docker命令"],
                "icon": "logo/docker.png"
            },
            type: "default"
        },
        "sql": {
            features: {
                "code": "sql",
                "explain": "sql操作手册",
                "cmds": ["sql手册"],
                "icon": "logo/sql.png"
            },
            type: "default"
        },
        "utools": {
            features: {
                "code": "utools",
                "explain": "uTools的API文档",
                "cmds": ["uToolsAPI"],
                "icon": "logo/utools.png"
            },
            type: "default"
        }
    };
    var db = utools.db.get("customFts"),
        customFts = db ? db.data : {},
        allFts = Object.assign(defaultFts, customFts);
    return allFts;
}


// 配置页面
showOptions = () => {
    $("#options").show();
    var currentFts = utools.getFeatures(),
        allFts = getAllFeatures();
    let featureList = '<table><tr><td></td><td>关键字</td><td>说明</td><td>启用</td><td>主输入框搜索</td></tr>';
    for (var fts in allFts) {
        let features = allFts[fts].features;
        var cmds = '';
        features.cmds.forEach(cmd => {
            if (typeof (cmd) == "string") cmds += `<span class="keyword">${cmd}</span>`;
        });
        var isChecked1 = '',
            isChecked2 = '',
            isDisabled = 'disabled';
        for(var c of currentFts){
            if (c.code == features.code) {
                isChecked1 = 'checked';
                isDisabled = '';
                if (typeof(c.cmds[c.cmds.length - 1]) != 'string') isChecked2 = 'checked';
                break;
            }
        }
        var editBtn = "",
            logoDir = "";
        if (allFts[fts].type != "default") {
            editBtn = `<span class="editBtn" code="${features.code}">✎</span>
            <span class="delBtn" code="${features.code}">✘</span>`;
        }
        featureList += `<tr><td><img class="logo" src="${features.icon}" onerror="this.src='logo.png'"></td>
        <td>${cmds}</td><td width="300px">${features.explain}</td><td>
        <label class="switch-btn">
        <input class="checked-switch" id="${features.code}_1" type="checkbox" ${isChecked1}>
        <span class="text-switch"></span>
        <span class="toggle-btn"></span>
        </label></td><td>
        <label class="switch-btn">
        <input class="checked-switch" id="${features.code}_2" type="checkbox" ${isDisabled} ${isChecked2}>
        <span class="text-switch"></span>
        <span class="toggle-btn"></span>
        </label>${editBtn}</td>`
    };
    featureList += `</tr></table><div class="foot">
    <div id="add" class="footBtn">添加手册</div>
    <div id="disableAll" class="footBtn">全部禁用</div>
    <div id="enableAll" class="footBtn">全部启用</div>
    </div>`
    $("#options").html(featureList);
}

showCustomize = () => {
    $("#customize").remove()
    customWindow = `<div id="customize">
    <p>名称:</p>
    <p><input type="text" id="code" placeholder="手册的名称, 请勿重复"></p>
    <p>关键字:</p>
    <p><input type="text" id="kw" placeholder="多个关键字用逗号隔开"></p>
    <p>说明:</p>
    <p><input type="text" id="desc" placeholder="手册功能的描述"></p>  
    <p>路径:</p>
    <p><span><input type="text" id="path" placeholder="手册的绝对路径"></span>
    <span class="selectBtn">选择文件夹</span></p>
    <p><button class="cancelBtn">取消</button>
    <button class="saveBtn">保存</button></p>`
    $("#options").append(customWindow)
    $("#customize").animate({ right: '0px'});
}

// 开关
$("#options").on('change', 'input[type=checkbox]', function () {
    var allFts = getAllFeatures(),
        id = $(this).attr('id').split('_'),
        code = id[0];
    if (id[1] == '1') {
        if (!utools.removeFeature(code)) {
            utools.setFeature(allFts[code].features);
            $(`#${code}_2`).prop('disabled', false);
        } else {
            $(`#${code}_2`).prop('checked', false);
            $(`#${code}_2`).prop('disabled', true);
        }
    } else {
        var featureConf = allFts[code].features;
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

// 底部功能按钮
$("#options").on('click', '.footBtn', function () {
    switch ($(this).attr('id')) {
        case 'add': showCustomize();
            break;
        case 'enableAll': $(".checked-switch:not(:checked)[id*='_1']").click();
            break;
        case 'disableAll': $(".checked-switch:checked").click();
            break;
    }
})

// 取消
$("#options").on('click', '.cancelBtn', function () {
    $("#customize").animate({ right: '-370px'});
})

// 编辑
$("#options").on('click', '.editBtn', function () {
    var code = $(this).attr('code');
    var data = utools.db.get("customFts").data[code];
    showCustomize();
    $("#code").attr('disabled', true);
    $('#code').val(data.features.code);
    $('#kw').val(data.features.cmds.toString());
    $('#desc').val(data.features.explain);
    $('#path').val(data.path);
})

// 删除
$("#options").on('click', '.delBtn', function () {
    var code = $(this).attr('code'),
        db = utools.db.get("customFts"),
        data = db.data;
    delete data[code];
    utools.removeFeature(code);
    utools.db.put({ _id: "customFts", data: data, _rev: db._rev }); 
    showOptions();
})

// 选择文件夹
$("#options").on('click', '.selectBtn', function () {
    $('#path').val(window.openFolder());
})

// 保存
$("#options").on('click', '.saveBtn', function () {
    var code = $('#code').val()
    var allFts = getAllFeatures();
    if (code in allFts && $("#code").prop('disabled') == false) {
        $('#code').css({ 'border-bottom-color': '#ec1212' })
        window.messageBox({ type: 'error', message: "名称与现有的手册重复！", buttons: ['朕知道了'] })
    } else {
        var kw = $('#kw').val().split(','),
            desc = $('#desc').val(),
            p = $('#path').val();
        $("#customize").animate({ right: '-370px' });
        var pushData = {},
            icon,
            type
        if (window.exists(`${p}/docSet.dsidx`)) {
            if (!window.exists(`${p}/${code}.json`)) {
                if (window.exists(`${p}/Tokens.xml`)) {
                    window.xml2Json(`${p}/Tokens.xml`, `${p}/${code}.json`)
                } else {
                    window.sqlite2Json(`${p}/docSet.dsidx`, `${p}/${code}.json`)
                }
            }
            icon = `${p}/../../icon@2x.png`;
            type = 'dash';
        } else {
            icon = `${p}/${code}.png`
            type = 'custom';
        }
        pushData[code] = {
            features: {
                "code": code,
                "explain": desc,
                "cmds": kw,
                "icon": icon
            },
            path: p,
            type: type
        }
        var db = utools.db.get("customFts");
        if (db) {
            var rev = db._rev
            var data = db.data
            data[code] = pushData[code];
            utools.db.put({ _id: "customFts", data: data, _rev: rev });
        } else {
            utools.db.put({ _id: "customFts", data: pushData });
        }
        showOptions();
    }
})
