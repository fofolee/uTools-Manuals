# 程序员手册 V1.0.3

## 简介

内置了十多个实用的离线中文手册，包括：Linux、PHP、Python、JS等,以及提供了搜索devdocs、dash/zeal上的文档的功能

手册具有以下三个特色：

- 内置多个手册均可离线使用，且90%以上是中文
- 可以自行添加手册
- 可以查询devdocs、dash/zeal上的文档

前身是之前发布的两个插件：

[PHP函数查询助手](https://yuanliao.info/d/329) [Linux命令查询手册](https://yuanliao.info/d/336)

## 基本操作

- 列表界面：
  - 查看选中的内容 `⏎`/`🖱左键`
  - 发送选中的内容至上一个活动窗口 `⇪ + ⏎`/`🖱中键`
  - 上下选择 `⇧`/`⇩`
- 手册界面
  - 切换列表和手册视图 `tab`/`🖱右键`
  - 发送选中的内容至上一个活动窗口 `⇪ + ⏎`/`🖱中键`
  - 搜索下一个关键词 `⏎`
  - 选中文本后翻译 `T`
  - 选中文本后收藏 `S`
- 退出插件 `esc`

## 更新

### v1.0.3

- 增加收藏的功能，调用官方的`收藏`插件进行收藏，手册界面选择文本后按`S`键即可收藏

- 调整划词翻译功能的UI

- 更新列表界面和手册界面字输入框内的说明，提示各个快捷键的功能

![1.gif](https://user-gold-cdn.xitu.io/2020/4/5/17145ebc2700a7a6?w=804&h=611&f=gif&s=531752)

### v1.0.2

- 增加划词翻译的功能，调用有道的英译中的接口。手册界面选中文本后按`T`键即可翻译

### v1.0.1

- 一些bug修复、、

### v1.0.0

- 上架 uTools 插件商店,算是正式版了,去除了内置的插件更新提示
- 修复两个滚动事件引起的BUG
- (~~似乎~~)修复了mac下退出后再次进入无法触发鼠标单击事件的BUG
- 修复`payload.json`文件会被某些杀毒软件误报的情况,现在已做加密处理

### v0.0.4

​	抱歉由于这段时间私事太多，插件疏于更新。感谢@Xinu在插件无法使用的时候帮忙发布了修复版本。

- 修复了uTools更新后进入插件空白的BUG
- 添加Linux支持
- 修复了退出手册后再次进入无法搜索的BUG，但是MacOS下任然存在一个诡异的BUG，退出后再次进入无法触发鼠标单击事件，建议勾选**隐藏即完全退出**选项，windows不受影响
- 修复了添加外置手册时使用多关键词会出现问题的BUG
- 现在外置的Java手册有图标了

### v0.0.3

又有一大波更新来袭

先做一个名词解释,本文中所提及的

**手册界面**为：

![UTOOLS1557242800409.png](https://i.loli.net/2019/05/07/5cd1a3b058870.png)

**列表界面**为：

![UTOOLS1557242777511.png](https://i.loli.net/2019/05/07/5cd1a399a2c46.png)


##### 功能更新

- 添加了快速将内容发送至活动窗口的功能，在列表界面按`shift+enter`或鼠标中键即可将选中的函数名称发送至上一个系统的活动窗口，在手册界面，选中相关文本内容后，按`shift+enter`或鼠标中键即可发送。查完api后再也不用慢悠悠地手动复制函数了~~

- 集成了`devdocs`，在`手册设置`页面，点击下方的英文手册按钮即可进入`devdocs`的配置页面

![UTOOLS1557237205596.png](https://i.loli.net/2019/05/07/5cd18dd58ced8.png)

​    需要先在该页面点击下载按钮下载相应的文档目录，之后便可和内置手册一样使用

![UTOOLS1557240920471.png](https://i.loli.net/2019/05/07/5cd19c58614cd.png)

![UTOOLS1557240455149.png](https://i.loli.net/2019/05/07/5cd19a8732d26.png)

![UTOOLS1557240886582.png](https://i.loli.net/2019/05/07/5cd19c3659474.png)

   需要注意的是`devdocs`所有文档的`api`列表中均无中文注释，且只有目录文件是离线存储的，访问具体的手册页面需要联网

- 现在`手册设置`页面可以在顶端输入框内搜索快速查找需要的文档

- 添加快速启动`dash`或者`zeal`的功能，通过关键字`dash`即可进入

![UTOOLS1557241588196.png](https://i.loli.net/2019/05/07/5cd19ef3eba37.png)

​    注意，不同于`devdocs`，最后会根据查询内容调用`dash`或者`zeal`进行查看，故需要先安装`dash`或者`zeal`才可以使用此功能

- 添加了多关键词查找的功能，现在想怎么搜就怎么搜~

![UTOOLS1557241948612.png](https://i.loli.net/2019/05/07/5cd1a05ca1521.png)

- 添加了一个内置手册`PyQt5`，同时在内置的`python`手册中添加了多个`tkinter`的实例

  添加了一个内置手册`payload`，收录了一些网络安全测试的常用`payload`，没有手册页面，主要配合新出的发送文本到窗口的功能，实现快速输入`payload`，目前收录的比较少，后续会陆续补充
  

![UTOOLS1557242094634.png](https://i.loli.net/2019/05/07/5cd1a0ee86d07.png)

- 增加外置手册时，如需自定义`css`，不再是添加单个`css`文件，而是统一放入`assets`目录中，相关外置手册说明同步更新

##### 用户体验改善

- 当在列表界面进行搜索后，点击进入手册界面，会清空顶端输入框内的值
- 在某些情况下（例如读取外置手册失败时）会输出一些报错信息

##### bug修复

- 修复了添加外置手册后滚动条没有调整的bug，以及某些时候滚动条未自动调整的bug
- 修复检测更新功能中，即使点了不再提醒，下次重启`uTools`时仍会再次出现的bug

##### 本项目现已在Github开源，地址见下载一栏，欢迎提交pr，大家一同完善本项目，如果喜欢也请不吝star~

### v0.0.2

##### 功能更新

- 增加外置手册的功能，需要有一定的编写爬虫脚本的能力，详情[戳我](https://yuanliao.info/d/356/27)
![Snipaste_2019-04-20_10-45-20.png](https://i.loli.net/2019/04/20/5cba8859b3a66.png)
![Snipaste_2019-04-20_10-46-11.png](https://i.loli.net/2019/04/20/5cba8863a5266.png)
- 增加了三个内置手册`javascript`,`jQuery`,`vue`,一个外置手册`Java`。由于`Java`体积太大（目录10M，手册100M+），会使整个插件体积暴增，故采取外置形式，同时也作为外置手册的一个案例作为参考。
- 增加了版本检测的功能，当有新版本时会弹窗提示
![Snipaste_2019-04-20_14-04-40.png](https://i.loli.net/2019/04/20/5cbab6a27136e.png)
- 在设置页面增加了两个功能键`全部启用`和`全部禁用`

##### 用户体验改善

- 优化搜索结果的排序，现在的排序规则是，置顶全字匹配的内容，优先显示名称匹配的内容，其次显示描述匹配的内容
  ![Snipaste_2019-04-19_21-58-45.png](https://i.loli.net/2019/04/19/5cb9d4282b7a1.png)
- 滚动条样式调整，现在滚动条会自动隐藏，并在滚动时和鼠标移至滚动条位置时出现
- 设置页面的开关样式调整，现在开关的状态更加清晰明了
- linux、C等语言的手册现在支持语法高亮了
- 其他一些界面微调

##### BUG修复

- 修复了第一次进入插件时、列表更新时、方向键选择列表时，鼠标所在位置会被选中的BUG
- 修复了方向键进行列表选择时，没有到最后一行就向下滚动的BUG

### v0.0.1

相较于之前两版，做了比较大的更新：

- 整合所有手册到一个插件当中，现在有多达**九个**语言或工具的手册
- 添加了一个配置页面，可以选择需要启动的功能（注：默认情况下所有手册均未启用，需要先通过`手册设置`命令进行配置）
![Snipaste_2019-04-08_20-46-17.png](https://i.loli.net/2019/04/08/5cab4e92369df.png)


- 支持直接在`uTools`主输入框进行快速搜索查询（或复制文本后5s内呼出`uTools`），可在配置页面选择开启
![Snipaste_2019-04-08_20-47-13.png](https://i.loli.net/2019/04/08/5cab4f6fac77e.png)

- 子输入框功能增强。

  在**列表界面**用来搜索函数/命令，并高亮匹配文本
![Snipaste_2019-04-08_20-50-09.png](https://i.loli.net/2019/04/08/5cab4f9789d08.png)

  在**手册界面**则可以进行当前文档内容的搜索（回车键跳转到匹配文本位置）
![Snipaste_2019-04-08_21-10-30.png](https://i.loli.net/2019/04/08/5cab4fa84d2ac.png)

- 添加了一个快捷键`TAB`，以在列表界面和手册界面之间进行切换

- 现在支持点击手册里的外部链接跳转到相应网址（通过默认浏览器打开，之前并不支持，不知道你们发现没~~）

- 界面微调

- 一些BUG修复

## 其他预览

![Snipaste_2019-04-06_03-00-13.png](https://i.loli.net/2019/04/06/5ca7a6e44d6af.png)
![Snipaste_2019-04-08_21-32-28.png](https://i.loli.net/2019/04/08/5cab4d73b0c8e.png)
![Snipaste_2019-04-06_03-01-12.png](https://i.loli.net/2019/04/06/5ca7a6f7bcdf4.png)
![Snipaste_2019-04-08_21-29-49.png](https://i.loli.net/2019/04/08/5cab4d354abe7.png)
![Snipaste_2019-04-08_21-31-23.png](https://i.loli.net/2019/04/08/5cab4d4b93e34.png)

## 安装

请直接在插件中心进行安装即可，或将本项目打包成`upx`安装

[项目地址](https://github.com/fofolee/uTools-Manuals)

[插件发布页](https://yuanliao.info/d/356)

[外置手册教程](https://yuanliao.info/d/356/27)

## 关键字

`手册设置` `dash` `linux命令` `php函数` `python库` `C函数` `vim命令` `git命令` `docker命令` `sql手册` `uToolsAPI` 等


## 手册一览

所有手册资源均来自网络，如有遗漏，请留言告知

- php手册   | [官方中文文档](https://www.php.net/download-docs.php)       
- linux手册 | [离线手册：linux-command@jaywcjlove](https://github.com/jaywcjlove/linux-command)  [原始数据：linuxde.net](http://man.linuxde.net/) 
- python手册 | [官方文档一译翻译版](https://yiyibooks.cn/xx/python_352/library/index.html)
  - beautifulSoup | [官方中文文档](https://www.crummy.com/software/BeautifulSoup/bs4/doc/index.zh.html)
  - requests | [官方中文文档](https://2.python-requests.org//zh_CN/latest/user/quickstart.html)
  - scrapy | [scrapy入门教程中文翻译](https://github.com/marchtea/scrapy_doc_chs)
  - pillow | [pillow官方文档中文翻译](https://pillow-cn.readthedocs.io/zh_CN/latest/)
  - tkinter | [易学教程](https://www.e-learn.cn/content/python/1101684)
- PyQt5文档 | [PyQt5中文教程](https://github.com/maicss/PyQt5-Chinese-tutorial)
- C函数 | C语言函数速查（Knocker 2004.7.7 版本 0.5）
- vim命令 | [awesome-cheatsheets](https://github.com/skywind3000/awesome-cheatsheets/blob/master/editors/vim.txt) 
- git命令 | [php中文网git开发手册](http://www.php.cn/manual/view/34942.html) 
- sql手册 | [php中文网sql参考手册](http://www.php.cn/manual/view/21301.html) 
- uTools API | [uTools官方文档](https://u.tools/docs/developer/api.html) 
- java | [fondme.cn](https://blog.fondme.cn/apidoc/jdk-1.8-google/) 
- javascript | [MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Index) 
- jQuery | [jQuery中文网](https://www.jquery123.com/) 
- vue | [官方中文文档](https://cn.vuejs.org/v2/api/) 
- payload | 收集自网络
- devdocs | [devdocs](https://devdocs.io/)

