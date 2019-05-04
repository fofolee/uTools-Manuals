// 正则转义
escapeRe = s => {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');   
}

// html实体编码
escapeHtml = s => {
    return s.replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "");
}

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
        let reg = new RegExp(escapeRe(text), "i",)
            match1 = reg.exec(i.name),
            match2 = reg.exec(i.desc),
            name = escapeHtml(i.name),
            desc = i.desc != undefined ? escapeHtml(i.desc) : "",
            type = i.type != undefined ? escapeHtml(i.type) : "";
        let initial = i.name.replace(/&lt;|&gt;|&quot;|&#039;/ig, '')
        initial = /^.*?([a-zA-Z])/.exec(initial);
        initial = initial ? initial[1].toUpperCase() : '&nbsp;';
        // 优先显示名称匹配的内容
        if (match1) {
            name = highlightList(name, match1[0]);
            if (match2) desc = highlightList(desc, match2[0]);
            // 置顶全字匹配的内容
            if (i.name.toUpperCase() == text.toUpperCase()) {
                obn.unshift(list(i.path, initial, type, name, desc));
            } else {
                obn.push(list(i.path, initial, type, name, desc));
            }
        // 其次显示描述匹配的内容
        } else if (match2) {
            desc = highlightList(desc, match2[0]);
            obd.push(list(i.path, initial, type, name, desc));
        }
    });
    window.info = obn.concat(obd);
    $("#mainlist").html(window.info.slice(0, listnum).join(''));
    let num = $(".info").length
    utools.setExpendHeight(num > 11 ? 550 : 50 * num);
    $(".select").removeClass('select');
    $(".info:first").addClass('select');
    // 鼠标锁，方式鼠标抢占选择条
    window.mouseLockTime = new Date().getTime();
}

// 显示手册
showManual = path => {
    utools.setExpendHeight(550);
    if (/^((ht|f)tps?):\/\//.test(path)) {
        window.open(path);
    } else {
        let e = /(.*?)(\.html)*#(.*)/.exec(path);
        if (e) {
            var f = e[1] + '.html';
            var id = '#' + e[3];
        } else {
            var f = window.dirs.idxFile ? path : path + '.html';
        }
        var file = `${window.dirs.docPath}/${f}`;
        $("#mainlist").fadeOut();
        $("#manual").fadeIn().html('<div class="load">Loading</div>')
        $.get(file, data => {
            // $("#manual").fadeOut().promise().done(() => {
                var relPath = f.substr(0, f.lastIndexOf('/') + 1);
                // a 标签改为相对路径
                data = data.replace(/(a.*?)href="(?!http)(.*?)"(.*?)(?!\#)/g, `$1href="${relPath}$2$3"`);
                // devdocs 语法高亮
                data = data.replace(/<pre data-language="(.*?)">([\s\S]*?)<\/pre>/g, '<pre><code class="language-$1">$2</code></pre>')
                $("#manual").html(`<div id="manualHead">${data}</div>`);
                Prism.highlightAll();
                location.href = e ? id : '#manualHead';
            })
        // })
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
    let cv = 'v0.0.2',
        pg = 'https://yuanliao.info/d/356';
    if (!utools.db.get(cv)) {
        $.get(pg, data => {
            data = /<title>\[插件\]\[程序员手册 (.*?)\](.*?) - 猿料<\/title>/.exec(data);
            let lv = data[1],
                desc = data[2];
            if (lv != cv) {
                options = {
                    type: 'info',
                    title: '插件有可用更新',
                    icon: window.getLogo(),
                    cancelId: 1,
                    message: `发现新版本 ${lv}，是否前往更新？\n更新内容：\n${desc}`,
                    buttons: ['起驾', '朕知道了', '别再烦朕']
                };
                window.messageBox(options, index => {
                    if (index == 0) {
                        window.open(pg)
                    } else if (index == 2) {
                        utools.db.put({ _id: cv, data: "pass" })
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
utools.onPluginEnter( async ({ code, type, payload }) => {
    init();
    checkUpdate();
    if (code == 'options') {
        window.defaultPage = 0;
        showOptions();
    } else {
        $("#mainlist").fadeIn();
        var allFts = /^dd_/.test(code) ? await getDevdocs() : await getManuals(),
            baseDir,
            css;
        switch (allFts[code].type) {
            case "default":
                baseDir = dirname;
                css = `${baseDir}/assets/${code}.css`
                window.dirs = {
                    idxFile: `${baseDir}/index/${code}.json`,
                    docPath: `${baseDir}/docs`,
                }
                break;
            case "custom":
                baseDir = allFts[code].path;
                css = `${baseDir}/${code}.css`
                window.dirs = {
                    idxFile: `${baseDir}/${code}.json`,
                    docPath: `${baseDir}`,
                }
                break;
            case "devdocs":
                window.dirs = {
                    docPath: allFts[code].url.slice(0, -11),
                }      
        }
        window.exists(css) && $("#manualCSS").attr("href", css);
        // 读取目录文件
        try {
            if (window.dirs.idxFile) {
                var index = await readFile(window.dirs.idxFile);
                index = JSON.parse(index);
            } else {
                var index = utools.db.get(code).data;
            }
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
        } catch(e) {
            $("#mainlist").html(e);
        }
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
    // 鼠标锁 500ms
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
