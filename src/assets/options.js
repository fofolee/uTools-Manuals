// 选择器转义
escapeJq = s => {
    return s.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );   
}

// 默认和自定义手册
getManuals = async () => {
    var defaultFts = await readFile(`${dirname}/features/default.json`);
    defaultFts = JSON.parse(defaultFts);
    var db = utools.db.get("customFts"),
        customFts = db ? db.data : {},
        allFts = Object.assign(defaultFts, customFts);
    return allFts;
}

// devdocs
getDevdocs = async () => {
    var devDocs = await readFile(`${dirname}/features/devdocs.json`);
    return JSON.parse(devDocs);
}

// 配置页面
showOptions = async () => {
    location.href = "#options";
    var currentFts = utools.getFeatures();
    var allFts = window.manualVars.defaultPage ? await getDevdocs() : await getManuals();
    let tableHead = `<table>
    <tr>
    <td></td>
    <td width="20%">关键字</td>
    <td width="45%">说明</td>
    <td width="10%">启用</td>
    <td width="20%">主输入框搜索</td>
    </tr>`,
        tableBody = '',
        topRows = '';
    for (var fts in allFts) {
        let configs = allFts[fts],
            features = configs.features;
        var cmds = '';
        features.cmds.forEach(cmd => {
            if (typeof (cmd) == "string") cmds += `<span class="keyword">${cmd}</span>`;
        });
        var isChecked1 = '',
            isChecked2 = '',
            isDisabled1 = '',
            isDisabled2 = 'disabled';
        for(var c of currentFts){
            if (c.code == features.code) {
                isChecked1 = 'checked';
                isDisabled2 = '';
                if (c.cmds[c.cmds.length - 1].type == 'regex') isChecked2 = 'checked';
                break;
            }
        }
        var tailBtn = "",
            topRow = false;
        if (configs.type == "custom") {
            tailBtn = `<span class="editBtn" code="${features.code}">✎</span>
            <span class="delBtn" code="${features.code}">✘</span>`;
        } else if (configs.type == "devdocs") {
            if (utools.db.get(features.code)) {
                tailBtn = `<span class="delBtn" code="${features.code}">✘</span>`;
                topRow = true;
            } else {
                tailBtn = `<span class="editBtn" code="${features.code}">⇩</span>`;
                isDisabled1 = 'disabled';
            }
        }
        var icon = exists(`${dirname}/${features.icon}`) ? features.icon : 'logo.png';
        var row = `<tr><td><img class="logo" src="${icon}"></td>
        <td>${cmds}</td><td>${features.explain}</td><td>
        <label class="switch-btn">
        <input class="checked-switch" id="${features.code}_1" type="checkbox" ${isDisabled1} ${isChecked1}>
        <span class="text-switch"></span>
        <span class="toggle-btn"></span>
        </label></td><td>
        <label class="switch-btn">
        <input class="checked-switch" id="${features.code}_2" type="checkbox" ${isDisabled2} ${isChecked2}>
        <span class="text-switch"></span>
        <span class="toggle-btn"></span>
        </label>${tailBtn}</td>`;
        topRow && (topRows += row) || (tableBody += row);
    };
    tableBody = topRows + tableBody + `</tr></table><div class="foot">
    <div id="add" class="footBtn">添加手册</div>
    <div id="devdocs" class="footBtn">英文手册</div>
    <div id="disableAll" class="footBtn">全部禁用</div>
    <div id="enableAll" class="footBtn">全部启用</div>
    </div>`;
    $("#options").html(tableHead + tableBody);
    if (window.manualVars.defaultPage) {
        $("#devdocs").html('中文手册');
        $('#add').addClass("disabled");
    }
    // 平滑过渡
    setTimeout(() => {
        $('#options').fadeIn(100).promise().done(() => {
            $('html').getNiceScroll().resize();
        })
    }, 50);
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
$("#options").on('change', 'input[type=checkbox]', async function () {
    var allFts = window.manualVars.defaultPage ? await getDevdocs() : await getManuals();
    var id = $(this).attr('id'),
        code = id.slice(0, -2),
        num = id.slice(-1);
    if (num == '1') {
        id = escapeJq(code);
        if ($(this).prop('checked')) {
            utools.setFeature(allFts[code].features);
            $(`#${id}_2`).prop('disabled', false);
        } else {
            utools.removeFeature(code);
            $(`#${id}_2`).prop('checked', false);
            $(`#${id}_2`).prop('disabled', true);
        }
    } else {
        var featureConf = allFts[code].features;
        if($(this).prop('checked')){
            featureConf.cmds.push({
                "type": "regex",
                "match":"/^[a-zA-Z._]{2,20}$/i",
                "label": featureConf.cmds[0]
            });
        }
        utools.setFeature(featureConf);
    }
});

// 底部功能按钮
$("#options").on('click', '.footBtn', function () {
    utools.setSubInputValue('');
    switch ($(this).attr('id')) {
        case 'add':
            $(this).hasClass("disabled") || showCustomize();
            break;
        case 'devdocs':
            window.manualVars.defaultPage = (window.manualVars.defaultPage + 1) % 2;
            $('#options').fadeOut(100).promise().done(() => {
                showOptions();
            })
            break;
        case 'enableAll':
            $(".checked-switch:not(:checked)[id*='_1']").click();
            break;
        case 'disableAll':
            $(".checked-switch:checked").click();
            break;
    }
})

// 取消
$("#options").on('click', '.cancelBtn', function () {
    $("#customize").animate({ right: '-370px'});
})

// 编辑
$("#options").on('click', '.editBtn', async function () {
    var code = $(this).attr('code');
    if (window.manualVars.defaultPage) {
        var docs = await getDevdocs(),
            url = docs[code].url;
        $(this).removeClass('editBtn');
        $(this).html('<i style="font-size:12px;color:#0277BD">Waiting...</i>')
        $.get(url, content => {
            utools.db.put({ _id: code, data: content.entries });
            showOptions();
        })
    } else {
        var data = utools.db.get("customFts").data[code];
        showCustomize();
        $("#code").attr('disabled', true);
        $('#code').val(data.features.code);
        $('#kw').val(data.features.cmds.toString());
        $('#desc').val(data.features.explain);
        $('#path').val(data.path);     
    }
})

// 删除
$("#options").on('click', '.delBtn', function () {
    var code = $(this).attr('code');
    if (window.manualVars.defaultPage) {
        utools.db.remove(code);
        utools.removeFeature(code);
    } else {
        var db = utools.db.get("customFts"),
            data = db.data;
        delete data[code];
        utools.removeFeature(code);
        utools.db.put({ _id: "customFts", data: data, _rev: db._rev }); 
    }
    showOptions();
})

// 选择文件夹
$("#options").on('click', '.selectBtn', function () {
    $('#path').val(window.openFolder());
})

// 保存
$("#options").on('click', '.saveBtn', async function () {
    var code = $('#code').val()
    var allFts = await getManuals();
    if (code in allFts && $("#code").prop('disabled') == false) {
        $('#code').css({ 'border-bottom-color': '#ec1212' })
        Swal.fire({ icon: 'error', text: '名称与现有的手册重复！!', })
    } else {
        var kw = $('#kw').val().split(','),
            desc = $('#desc').val(),
            p = $('#path').val();
        $("#customize").animate({ right: '-370px' });
        var pushData = {};
        pushData[code] = {
            features: {
                "code": code,
                "explain": desc,
                "cmds": kw,
                "icon": `logo/${code}.png`
            },
            path: p,
            type: 'custom'
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
