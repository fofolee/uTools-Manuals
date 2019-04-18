// 正则转义
RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// 列表
list = (path, initial, type, name ,desc) => {
    return `<div class='info' path='${path}'>
    <div class="initial">${initial}</div>
    <div class="type">${type}</div>
    <div class="name">${name}</div>
    <div class="description">${desc}</div>
    </div>`
}

// 显示列表
showList = (text, index, listnum) => {
    window.info = [];
    var obn = [];
    var obd = [];
    index.forEach(i => {
        let name = i.name,
            desc = i.desc != undefined ? i.desc : "",
            initial = name.slice(0, 1).toUpperCase(),
            reg = new RegExp(RegExp.escape(text), "i"),
            match1 = reg.exec(name),
            match2 = reg.exec(desc);
        // 优先显示名称匹配的内容
        if (match1) {
            name = highlightList(name, match1[0]);
            if (match2) desc = highlightList(desc, match2[0]);
            // 置顶全字匹配的内容
            if (i.name.toUpperCase() == text.toUpperCase()) {
                obn.unshift(list(i.path, initial, i.type, name, desc));
            } else {
                obn.push(list(i.path, initial, i.type, name, desc));
            }
        // 其次显示描述匹配的内容
        } else if (match2) {
            desc = highlightList(desc, match2[0]);
            obd.push(list(i.path, initial, i.type, name, desc));
        }
    });
    window.info = obn.concat(obd);
    $("#mainlist").html(window.info.slice(0, listnum).join(''));
    let num = $(".info").length
    utools.setExpendHeight(num > 11 ? 550 : 50 * num);
    $(".select").removeClass('select');
    $(".info:first").addClass('select');
    window.mouseLockTime = new Date().getTime();
}

// 显示手册
showManual = path => {
    utools.setExpendHeight(550);
    if (/^((ht|f)tps?):\/\//.test(path)) {
        window.open(path);
    } else {
        let p = path.split('.html#')
        if (p.length == 2) {
            var f = p[0] + '.html';
            var id = '#' + p[1];
        } else {
            var f = p[0]
        }
        var file = `${window.dirs.docPath}/${f}`;
        window.read(file, (err, data) => {
            if (!err) {
                $("#mainlist").fadeOut();
                $("#manual").fadeOut().promise().done(() => {
                    var filePath = f.substr(0, f.lastIndexOf('/') + 1);
                    data = data.replace(/href="(?!http)(.*?)"(.*?)(?!\#)/g, `href="${filePath}$1$2"`);
                    data = data.replace(/src="(?!http)(.*?)"/g, `src="${filePath}$1"`);
                    $("#manual").html(`<div id="manualHead">${data}</div>`).fadeIn();
                    Prism.highlightAll();
                    location.href = p.length == 2 ? id : '#manualHead';
                })
            } else {
                console.log(err);
            }
        })
    }
}

// 手册搜索结果高亮
highlightManual = text => {
    $("#manual").removeHighlight() ;
    if (text) {
        $("#manual").highlight(text);
        window.findex = 0;
    }
}

// 列表搜索结果高亮
highlightList = (string, match) => string.replace(match, `<span style="color:#ff5722">${match}</span>`)

// 初始化
init = () => {
    $("#mainlist").fadeOut(0);
    $("#options").fadeOut(0);
    $("#manual").fadeOut(0);
    $("html").niceScroll();
    $("#manual").niceScroll();
}

// 检查升级
checkUpdate = () => {
    let cv = 'v0.0.1',
        pg = 'https://yuanliao.info/d/356';
    if (localStorage[cv] != 'pass') {
        $.get(pg, data => {
          data = /<title>\[插件\]\[程序员手册 (.*?)\](.*?) - 猿料<\/title>/.exec(data);
            let lv = data[1],
                desc = data[2];
            if (lv != cv) {
                options = {
                    type: 'info',
                    title: '可用更新',
                    cancelId: 1,
                    message: `发现新版本 ${lv}，是否前往更新？\n更新内容：\n${desc}`,
                    buttons: ['起驾', '朕知道了', '别再烦朕']
                };
                window.messageBox(options, index => {
                    if (index == 0) {
                        window.open(pg)
                    } else if (index == 2) {
                        localStorage[cv] = 'pass';
                    }
                })
            }
        })
    }
}

// 切换列表和手册视图
toggleView = () => {
    if ($("#manual").is(":hidden") && $("#mainlist").is(":visible")) {
        $("#manual").fadeIn();
        $("#mainlist").fadeOut();
    } else if ($("#manual").is(":visible") && $("#mainlist").is(":hidden")) {
        $("#manual").fadeOut();
        $("#mainlist").fadeIn();
    }
}

// 加载剩余列表
loadList = listnum => {
    if ($(window).scrollTop() >= (listnum * 50 - 550) && $(".info").length <= listnum) {      
        $("#mainlist").append(window.info.slice(listnum).join(''));
    }
}

// 进入插件
utools.onPluginEnter(({ code, type, payload }) => {
    init();
    checkUpdate();
    if (code == 'options') {
        showOptions();
    } else {
        $("#mainlist").fadeIn();
        var allFts = getAllFeatures();
        switch (allFts[code].type) {
            case "default":
                var baseDir = window.getDirname();
                if (window.exists(`${baseDir}/assets/${code}.css`)) {
                    $("#manualCSS").attr("href", `assets/${code}.css`)
                }
                window.dirs = {
                    idxFile: `${baseDir}/index/${code}.json`,
                    docPath: `${baseDir}/docs`
            }
                break;
            case "custom":
                var baseDir = allFts[code].path;
                window.dirs = {
                    idxFile: `${baseDir}/${code}.json`,
                    docPath: `${baseDir}`,
                }
                break;
            case "dash":
                var baseDir = allFts[code].path;
                window.dirs = {
                    idxFile: `${baseDir}/${code}.json`,
                    docPath: `${baseDir}/Documents`,
                }
                break;
        }
        // 读取目录文件
        window.read(window.dirs.idxFile, (err, data) => {
            let index = JSON.parse(data);
            if (type == 'over') {
                showList(payload, index, 500)
            } else {
                showList('', index, 500)
            }
            // 子输入框
            utools.setSubInput(({ text }) => {
                if ($('#manual').is(':hidden')) {
                    showList(text, index, 500);
                } else {
                    highlightManual(text);
                }
            }, '输入名称或功能进行查询');
        });
    }
});

// 单击列表，显示手册
$("#mainlist").on('mousedown', '.info', function (e) {
    if (1 == e.which) {
        showManual($(".select").attr('path'));
    }
});

// 鼠标滑过列表，高亮
$("#mainlist").on('mousemove', '.info', function () {
    // 设置500ms的鼠标锁
    var mouseUnlockTime = new Date().getTime();
    if (mouseUnlockTime - window.mouseLockTime > 500) {
        $(".select").removeClass('select');
        $(this).addClass('select');
    }
});  

// 右键单击手册，退出手册
$("#manual").on('mousedown', function (e) {
    if (3 == e.which) {
        toggleView();
    }
})

// 手册中a标签
$("#manual").on('mousedown', 'a', function (e) {
    if (1 == e.which) {
        showManual($(this).attr('href'));
    }
});

// 滚动到边界加载列表
$(document).scroll(() => {
    loadList(500);
})

// 按键监听
$(document).keydown(e => {
    switch (e.keyCode) {
        // TAB
        case 9:
            toggleView();
            break;
        // 回车
        case 13:
            // 列表界面进入手册
            if ($('#manual').is(':hidden')) {
                showManual($(".select").attr('path'));
            // 手册界面搜索下一个
            } else {
                if (window.findex > 0) {
                    $(`.founds:eq(${window.findex - 1})`).removeClass('firstFound');
                } else {
                    $('.founds:last').removeClass('firstFound');  
                }
                $(`.founds:eq(${window.findex})`).addClass('firstFound');
                $('.firstFound').get(0).scrollIntoView({ behavior: "smooth", block: "nearest" });
                if (window.findex == $('.founds').length - 1) {
                    window.findex = 0;
                } else {
                    window.findex += 1;
                }
            }
            break;
        // 上
        case 38:
            let pre = $(".select").prev();
            // 没有到达边界时移动选择条
            if(pre.length != 0){
                // event.preventDefault();
                if(pre.offset().top < $(window).scrollTop()){
                    $("html").animate({ scrollTop: "-=50" }, 0);
                }
                pre.addClass("select");
                $(".select:last").removeClass("select");
            // 到达边界闪烁移动选择条
            }else{
                $(".select").animate({"opacity":"0.3"}).delay(500).animate({"opacity":"1"})
            }
            break;
        // 下
        case 40:
            let next = $(".select").next();
            // 没有到达边界时移动选择条
            if(next.length !=0){
                // event.preventDefault();
                if(next.offset().top >= $(window).scrollTop() + 550){
                    $("html").animate({ scrollTop: "+=50" }, 0);
                }
                loadList(500);
                next.addClass("select");
                $(".select:first").removeClass("select");
            // 到达边界闪烁移动选择条
            }else{
                $(".select").animate({"opacity":"0.3"}).delay(500).animate({"opacity":"1"})
            }
            break;
    }
});
