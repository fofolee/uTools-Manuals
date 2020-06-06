// html实体编码
escapeHtml = s => {
    return s.replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 显示列表
showList = (text, index, listnum) => {
    window.manualVars.infoRows = [];
    var topRows = [],
        tailRows = [];
    if(text) text = text.toUpperCase()
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
    window.manualVars.infoRows = topRows.concat(tailRows);
    $("#mainlist").html(window.manualVars.infoRows.slice(0, listnum).join(''));
    let num = $(".info").length
    utools.setExpendHeight(num > 11 ? 550 : 50 * num);
    $(".select").removeClass('select');
    $(".info:first").addClass('select');
    $('html').getNiceScroll().resize();
    // 鼠标锁，方式鼠标抢占选择条
    window.manualVars.mouseLockTime = new Date().getTime();
}

// 列表界面子输入框
mainlistSubInput = () => {
    utools.removeSubInput();
    utools.setSubInput(({ text }) => {
        // 列表搜索
            showList(text, index, 300);
            // 高亮结果
            text.split(' ').forEach(keyword => {
                keyword && $(".name,.description").highlight(keyword, 'listFounds');
            });
    }, '空格 多关键词搜索；中键/shift+Enter发送选中条目到活动窗口');
}

// 手册界面子输入框
manualSubInput = () => {
    utools.removeSubInput();
    utools.setSubInput(({ text }) => {
        highlightManual("#manual", text);
    }, '空格 多关键词；选中：中键/shift+Enter发送，T翻译，S收藏；Tab切换界面');
}


// 显示手册
showManual = path => {
    utools.setExpendHeight(550);
    $('#manual').getNiceScroll().resize()
    if (/^((ht|f)tps?):\/\//.test(path)) {
        window.open(path);
    } else {
        let e = /(.*?)(\.html)*#(.*)/.exec(path);
        if (e) {
            var f = e[1] + '.html';
            var id = '#' + e[3];
        } else {
            var f = window.manualVars.dirs.idxFile ? path : path + '.html';
        }
        var file = `${window.manualVars.dirs.docPath}/${f}`;
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
            $("#manualBody").html(data)
            $("#manual").fadeIn()
            Prism.highlightAll();
            location.href = e ? id : '#manualBody';
            $('#manualNavi').autoMenu();
            if ($('h1,h2,h3').length < 10 && $('#manual ul').is(":visible")) {
                $('.btn-box span').removeClass('icon-minus-sign').addClass('icon-plus-sign')
                // $('#manualBody').removeClass('withNaviBar')
                $('#manual ul').hide()
            // } else {
            //     $('#manualBody').addClass('withNaviBar')
            }
            manualSubInput();
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
        window.manualVars.findex = 0;
    }
}

// 初始化
scrollInit = () => {
    $("html").niceScroll({
        enablekeyboard: false
    });
    $("#manual").niceScroll({
        enablekeyboard: true
    });
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
        manualSubInput();
    } else if ($("#manual").is(":visible") && $("#mainlist").is(":hidden")) {
        $("#manual").fadeOut();
        $("#infopannel").fadeOut();
        $("#mainlist").fadeIn();
        let num = $(".info").length
        utools.setExpendHeight(num > 11 ? 550 : 50 * num);
        mainlistSubInput();
    }
}

// 继续加载内容
loadList = addnum => {
    if ($('#manual').is(':hidden') && $("#mainlist").is(":visible") && window.manualVars.infoRows) {
        var listnum = $(".info").length;
        if ($(window).scrollTop() >= (listnum * 50 - 550)) {
            $("#mainlist").append(window.manualVars.infoRows.slice(listnum, listnum + addnum).join(''));
            $('html').getNiceScroll().resize();
        }
    }
}

// 进入插件
utools.onPluginEnter( async ({ code, type, payload }) => {
    scrollInit();
    // checkUpdate();
    window.manualVars = {}
    if (code == 'options') {
        window.manualVars.defaultPage = 0;
        showOptions();
        utools.setSubInput(({ text }) => {
            highlightManual(".keyword", text);
        }, '输入关键词快速查找文档');
    } else if (code == 'dash') {
        utools.setExpendHeight(0);
        utools.setSubInput(({ text }) => {
            window.manualVars.dashQuery = text;
        }, '输入关键词进行查询,例如 nodejs:fs');
    } else {
        $("#mainlist").fadeIn();
        var allFts = /^dd_/.test(code) ? await getDevdocs() : await getManuals(),
            baseDir,
            assetDir;
        switch (allFts[code].type) {
            case "default":
                baseDir = dirname;
                assetDir = `${baseDir}/assets/styles/${code}`
                window.manualVars.dirs = {
                    idxFile: `${baseDir}/index/${code}.json`,
                    docPath: `${baseDir}/docs`,
                }
                break;
            case "custom":
                baseDir = allFts[code].path;
                assetDir = `${baseDir}/assets`
                window.manualVars.dirs = {
                    idxFile: `${baseDir}/${code}.json`,
                    docPath: `${baseDir}`,
                }
                break;
            case "devdocs":
                assetDir = '';
                window.manualVars.dirs = {
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
                $('head').append('<link rel="stylesheet" href="assets/styles/manual.css" name="manual">')
            }
        })
        // 读取目录文件
        try {
            if (window.manualVars.dirs.idxFile) {
                index = await readFile(window.manualVars.dirs.idxFile);
                if (window.manualVars.dirs.idxFile.includes('payload.json')) {
                    index = JSON.parse(rc4(index, 'uTools'))
                } else {
                    index = JSON.parse(index);                   
                }
            } else {
                index = utools.db.get(code).data;
            }
            // 子输入框
            if ($('#manual').is(':hidden')) {
                mainlistSubInput();
            } else {
                manualSubInput();
            }
            if (type == 'regex') {
                utools.setSubInputValue(payload)
                // showList(payload, index, 300)
            } else {
                utools.setSubInputValue('')
                // showList('', index, 300)
            }
            if (type == 'window') {
                utools.hideMainWindow();
                copy();
                utools.showMainWindow();
                paste();
            }
        } catch(e) {
            $("#mainlist").html(e);
        }
    }
});

utools.onPluginOut(() => {
    $("#mainlist").html('').hide();
    $("#options").html('').hide();
    $("#manual").hide();
    $("#manualBody").html('')
    $("#manualNavi").html('')
    $(".load").html('').hide();
    $("#infopannel").html('').hide();;
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
    if (mouseUnlockTime - window.manualVars.mouseLockTime > 500) {
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
    } else if (1 == e.which) {
        $("#infopannel").fadeOut(300);
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
    loadList(300);
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
                if (window.manualVars.findex > 0) {
                    $(`.founds:eq(${window.manualVars.findex - 1})`).removeClass('firstFound');
                } else {
                    $('.founds:last').removeClass('firstFound');  
                }
                $(`.founds:eq(${window.manualVars.findex})`).addClass('firstFound');
                $('.firstFound').get(0).scrollIntoView({ behavior: "smooth", block: "center" });
                if (window.manualVars.findex == $('.founds').length - 1) {
                    window.manualVars.findex = 0;
                } else {
                    window.manualVars.findex += 1;
                }
            // 快速启动 dash
            } else if (window.manualVars.dashQuery) {
                 window.dash(window.manualVars.dashQuery);
            }
            break;
        // 上
        case 38:
            if ($('#manual').is(':hidden') && $("#mainlist").is(":visible")) {
                let pre = $(".select").prev();
                // 没有到达边界时移动选择条
                if (pre.length != 0) {
                    if (pre.offset().top < $(window).scrollTop()) {
                        $("html").animate({ scrollTop: "-=50" }, 0);
                    }
                    pre.addClass("select");
                    $(".select:last").removeClass("select");
                    // 到达边界闪烁移动选择条
                } else {
                    $(".select").animate({ "opacity": "0.3" }).delay(500).animate({ "opacity": "1" })
                }
            }
            break;
        // 下
        case 40:
            if ($('#manual').is(':hidden') && $("#mainlist").is(":visible")) {
                let next = $(".select").next();
                // 没有到达边界时移动选择条
                if (next.length != 0) {
                    if (next.offset().top >= $(window).scrollTop() + 550) {
                        $("html").animate({ scrollTop: "+=50" }, 0);
                    }
                    loadList(300);
                    next.addClass("select");
                    $(".select:first").removeClass("select");
                    // 到达边界闪烁移动选择条
                } else {
                    $(".select").animate({ "opacity": "0.3" }).delay(500).animate({ "opacity": "1" })
                }
            }
            break;
        // 收藏
        case 83:
            if ($('#mainlist').is(':hidden') && $("#manual").is(":visible")) {
                let text = window.getSelection().toString();
                if (text) {
                    utools.redirect('收藏', {
                        'type': 'text',
                        'data': text
                    })
                }
            }
            break;
        // 划词翻译
        case 84:
            if ($('#mainlist').is(':hidden') && $("#manual").is(":visible")) {
                let text = window.getSelection().toString();
                if (text) {
                    // if (/[\u4e00-\u9fa5]/.test(text)){
                        // utools.showNotification('中文你还看不懂嘛！', clickFeatureCode = null, silent = true)
                    // } else {
                        let enText = encodeURIComponent(text)
                        $("#infopannel").html('在线翻译中...').fadeIn(300);
                        $.get("http://fanyi.youdao.com/translate?&doctype=json&type=EN2ZH_CN&i=" + enText, data => {
                            let result = data.translateResult;
                            let cnText = '';
                            // 每段
                            for (var r of result) {
                                // 每句
                                for (var a of r) {
                                    cnText += a.tgt;
                                }
                                cnText += '<br>';
                            }
                            $("#infopannel").html(cnText)
                        })   
                    // }
                }
            }
            break;
    }
});