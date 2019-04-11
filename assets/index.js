// 显示列表
showList = (text, index, listnum) => {
    window.info = [];
    Object.keys(index).filter(key => {
        let v = index[key];
        let name = v.name;
        let desc = v.desc
        let reg = new RegExp(text, "i");
        let match1 = reg.exec(name);
        let match2 = reg.exec(desc)
        if (match1 || match2) { 
            let initial = name.slice(0, 1).toUpperCase();
            if (match1) name = highlightList(name, match1[0]);
            if (match2) desc = highlightList(desc, match2[0]);
            window.info.push(`<div class='info' path='${v.path}'>
                          <div class="initial">${initial}</div>
                          <div class="type">${v.type}</div>
                          <div class="name">${name}</div>
                          <div class="description">${desc}</div>
                          </div>`);
        }
    })
    $("#mainlist").html(window.info.slice(0, listnum).join(''));
    $(".info:first").addClass('select');
    let num = $(".info").length
    utools.setExpendHeight(num > 11 ? 550 : 50 * num);
}

// 显示手册
showManual = path => {
    utools.setExpendHeight(550);
    if (/^((ht|f)tps?):\/\//.test(path)) {
        window.open(path);
    } else {
        let p = path.split('.html#')
        if (p.length == 2) {
            var file = p[0] + '.html';
            var id = '#' + p[1];
        } else {
            var file = p[0]
        }
        window.read(`${window.baseDir}/docs/${file}`, (err, data) => {
            if (!err) {
                $("#mainlist").fadeOut();
                $("#content").fadeOut().promise().done(() => {
                    $("#content").html(`<div id="head">${data}</head>`).fadeIn();
                    if (p.length == 2) {
                        location.href = id;
                    } else {
                        location.href = '#head'
                    }
                })
            }
        })
    }
}

// 手册搜索结果高亮
highlightManual = text => {
    $("#content").removeHighlight() ;
    if (text) {
        $("#content").highlight(text);
        window.findex = 0;
    }
}

// 列表搜索结果高亮
highlightList = (string, match) => string.replace(match, `<span style="color:#ff5722">${match}</span>`)

// 隐藏所有窗口
init = () => {
    $("#mainlist").fadeOut(0);
    $("#options").fadeOut(0);
    $("#content").fadeOut(0);
}

// 切换列表和手册视图
toggleView = () => {
    if ($('#content').is(':hidden')) {
        $('#content').fadeIn();
        $("#mainlist").fadeOut();
    } else {
        $("#content").fadeOut();
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
    if (code == 'options') {
        showOptions();
    } else {
        $("#mainlist").fadeIn();
        var allFts = getAllFeatures();
        if (allFts[code].type == "default") {
            window.baseDir = window.getDirname();
        } else {
            window.baseDir = allFts[code].path
        }
        // 读取目录文件
        window.read(`${window.baseDir}/index/${code}.json`, (err, data) => {
            let index = JSON.parse(data);
            if (type == 'over') {
                showList(payload, index, 500)
            } else {
                showList('', index, 500)
            }
            // 子输入框
            utools.setSubInput(({ text }) => {
                if ($('#content').is(':hidden')) {
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
    $(".select").removeClass('select');
    $(this).addClass('select');
});

// 右键单击手册，退出手册
$("#content").on('mousedown', function (e) {
    if (3 == e.which) {
        toggleView();
    }
})

// 手册中a标签
$("#content").on('mousedown', 'a', function (e) {
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
            if ($('#content').is(':hidden')) {
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
                event.preventDefault();
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
                event.preventDefault();
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
