// html实体编码
escapeHtml = s => {
    return s.replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 显示列表
showList = (text, index, listnum) => {
    window.infoRows = [];
    var topRows = [],
        tailRows = [];
    index.forEach(i => {
        let desc = i.desc != undefined ? i.desc : "",
            displayName = escapeHtml(i.name),
            displatDesc = escapeHtml(desc),
            displayType = i.type != undefined ? escapeHtml(i.type) : "",
            upName = i.name.toUpperCase(),
            upDesc = desc.toUpperCase(),
            initial = upName.slice(0, 1),
            topRow = true,
            matched = true;
        // 多关键词搜索
        text.trim().split(' ').forEach(keyword => {
            upName.includes(keyword) || (topRow = false);
            (upName.includes(keyword) || upDesc.includes(keyword)) || (matched = false);
        })
        var list = `<div class='info' path='${i.path}'>
        <div class="initial">${initial}</div>
        <div class="type">${displayType}</div>
        <div class="name">${displayName}</div>
        <div class="description">${displatDesc}</div>
        </div>`
        // 排序规则：置顶全字匹配，优先显示名称匹配
        topRow && ((upName == text) && topRows.unshift(list) || topRows.push(list)) || (matched && tailRows.push(list));
    });
    window.infoRows = topRows.concat(tailRows);
    $("#mainlist").html(window.infoRows.slice(0, listnum).join(''));
    let num = $(".info").length
    utools.setExpendHeight(num > 11 ? 550 : 50 * num);
    $(".select").removeClass('select');
    $(".info:first").addClass('select');
    $('html').getNiceScroll().resize();
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
        $(".load").html('Loading').show();
        var request = $.ajax({
            url: file,
            type: "GET",
        });
        request.done(data => {
            $(".load").hide();
            var relPath = f.substr(0, f.lastIndexOf('/') + 1);
            // a 标签改为相对路径
            data = data.replace(/(a.*?)href="(?!http)([^\#].*?)"/g, `$1href="${relPath}$2"`);
            // devdocs 语法高亮
            data = data.replace(/<pre.*?data-language="(.*?)">([\s\S]*?)<\/pre>/g, '<pre><code class="language-$1">$2</code></pre>')
            $("#manual").html(`<div id="manualBody">${data}</div>`).fadeIn();
            Prism.highlightAll();
            location.href = e ? id : '#manualBody';
            utools.setSubInputValue('');
        });
        request.fail(function (xhr, err) {
            $(".load").html('404').fadeOut();
            console.log(xhr, err);
        });
    }
}

// 手册/配置页搜索结果高亮
highlightManual = (selector, text) => {
    $(selector).removeHighlight('founds') ;
    if (text) {
        $(selector).highlight(text, 'founds');
        window.findex = 0;
    }
}

// 初始化
scrollInit = () => {
    $("html").niceScroll();
    $("#manual").niceScroll();
}

// 向活动窗口发送文本
sendText = text => {
    window.copyTo(text);
    utools.hideMainWindow();
    window.paste();
}

// 切换列表和手册视图
toggleView = () => {
    if ($("#manual").is(":hidden") && $("#mainlist").is(":visible")) {
        $("#manual").fadeIn();
        $("#mainlist").fadeOut();
        utools.setExpendHeight(550);
    } else if ($("#manual").is(":visible") && $("#mainlist").is(":hidden")) {
        $("#manual").fadeOut();
        $("#mainlist").fadeIn();
        let num = $(".info").length
        utools.setExpendHeight(num > 11 ? 550 : 50 * num);
    }
}

// 继续加载内容
loadList = addnum => {
    if ($('#manual').is(':hidden') && $("#mainlist").is(":visible")) {
        var listnum = $(".info").length;
        if ($(window).scrollTop() >= (listnum * 50 - 550)) {
            $("#mainlist").append(window.infoRows.slice(listnum, listnum + addnum).join(''));
            $('html').getNiceScroll().resize();
        }
    }
}

// 进入插件
utools.onPluginEnter( async ({ code, type, payload }) => {
    scrollInit();
    checkUpdate();
    if (code == 'options') {
        window.defaultPage = 0;
        showOptions();
        utools.setSubInput(({ text }) => {
            highlightManual(".keyword", text);
        }, '输入关键词快速查找文档');
    } else if (code == 'dash') {
        utools.setExpendHeight(0);
        utools.setSubInput(({ text }) => {
            window.dashQuery = text;
        }, '输入关键词进行查询,例如 nodejs:fs');
    } else {
        $("#mainlist").fadeIn();
        var allFts = /^dd_/.test(code) ? await getDevdocs() : await getManuals(),
            baseDir,
            assetDir;
        switch (allFts[code].type) {
            case "default":
                baseDir = dirname;
                assetDir = `${baseDir}/assets/${code}`
                window.dirs = {
                    idxFile: `${baseDir}/index/${code}.json`,
                    docPath: `${baseDir}/docs`,
                }
                break;
            case "custom":
                baseDir = allFts[code].path;
                assetDir = `${baseDir}/assets`
                window.dirs = {
                    idxFile: `${baseDir}/${code}.json`,
                    docPath: `${baseDir}`,
                }
                break;
            case "devdocs":
                assetDir = '';
                window.dirs = {
                    docPath: allFts[code].url.slice(0, -11),
                }
                break;
        }
        // 自定义 CSS、JS情况下
        window.readDir(assetDir, (err, files) => {
            if (!err) {
                files.forEach(file => {
                    $('head').append(`<link rel="stylesheet" href="${assetDir}/${file}" name="manual">`)
                }) 
            } else {
                $('head').append('<link rel="stylesheet" href="assets/manual.css" name="manual">')
            }
        })
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
                // 列表搜索
                if ($('#manual').is(':hidden')) {
                    showList(text.toUpperCase(), index, 500);
                    // 高亮结果
                    text.split(' ').forEach(keyword => {
                        keyword && $(".name,.description").highlight(keyword, 'listFounds');
                    });
                // 手册搜索
                } else {
                    highlightManual("#manual", text);
                }
            }, '输入名称或功能进行查询');
        } catch(e) {
            $("#mainlist").html(e);
        }
    }
});

utools.onPluginOut(() => {
    $("#mainlist").html('');
    $("#options").html('');
    $("#manual").html('');
    $('link[name="manual"]').remove();
})

// 单击列表，显示手册; 中键发送文本
$("#mainlist").on('mousedown', '.info', function (e) {
    if (1 == e.which) {
        var path = $(".select").attr('path');
        path && showManual(path);
    } else if (2 == e.which) {
        sendText($('.select .name').text());
    } else if (3 == e.which) {
        toggleView();
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

// 右键单击手册，退出手册; 中键发送文本
$("#manual").on('mousedown', function (e) {
    if (3 == e.which) {
        toggleView();
    } else if (2 == e.which) {
        var select = document.getSelection().toString();
        select && sendText(select);
    }
})

// 手册中a标签
$("#manual").on('mousedown', 'a', function (e) {
    if (1 == e.which) {
        var href = $(this).attr('href');
        /^\#/.test(href) || showManual(href);
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
            // 按住shift键则发送文本
            if (event.shiftKey) {
                if ($('#manual').is(':hidden') && $("#mainlist").is(":visible")) {
                    sendText($('.select .name').text());
                } else if($('#manual').is(':visible') && $("#mainlist").is(":hidden")){
                    var select = document.getSelection().toString();
                    select && sendText(select);
                }
                return;
            } 
            // 列表界面进入手册
            if ($('#manual').is(':hidden') && $("#mainlist").is(":visible")) {
                var path = $(".select").attr('path');
                path && showManual(path);
            // 手册/配置界面搜索下一个
            } else if($('.founds').length){
                if (window.findex > 0) {
                    $(`.founds:eq(${window.findex - 1})`).removeClass('firstFound');
                } else {
                    $('.founds:last').removeClass('firstFound');  
                }
                $(`.founds:eq(${window.findex})`).addClass('firstFound');
                $('.firstFound').get(0).scrollIntoView({ behavior: "smooth", block: "center" });
                if (window.findex == $('.founds').length - 1) {
                    window.findex = 0;
                } else {
                    window.findex += 1;
                }
            // 快速启动 dash
            } else if (window.dashQuery) {
                 window.dash(window.dashQuery);
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
