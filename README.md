# 程序员手册 V0.0.2

## 简介

内置了多个实用的离线中文手册，目前包括：内置了多个实用的离线中文手册，包括：Linux、PHP、Python、JS、C、Vim、Git、Docker、Sql、uTools等

手册具有以下两个特色：

- 离线使用
- 90%以上是中文

前身是之前发布的两个插件：

[PHP函数查询助手](https://yuanliao.info/d/329) [Linux命令查询手册](https://yuanliao.info/d/336)

## 更新

### v0.0.2

##### 功能更新

<<<<<<< HEAD
- 增加外置手册的功能，需要有一定的编写爬虫脚本的能力，详情[戳我](https://yuanliao.info/d/356/27)
=======
- 增加外置手册的功能，需要有一定的编写爬虫脚本的能力，详情[戳我]()
>>>>>>> 3c522286bb5491f9d6794dc53d0ced8572e14111
![Snipaste_2019-04-20_10-45-20.png](https://i.loli.net/2019/04/20/5cba8859b3a66.png)
![Snipaste_2019-04-20_10-46-11.png](https://i.loli.net/2019/04/20/5cba8863a5266.png)
- 增加了三个内置手册`javascript`,`jQuery`,`vue`,一个外置手册`Java`。由于`Java`体积太大（目录10M，手册100M+），会使整个插件体积暴增，故采取外置形式，同时也作为外置手册的一个案例作为参考。
- 增加了版本检测的功能，当有新版本时会弹窗提示
<<<<<<< HEAD
![Snipaste_2019-04-20_14-04-40.png](https://i.loli.net/2019/04/20/5cbab6a27136e.png)
=======
>>>>>>> 3c522286bb5491f9d6794dc53d0ced8572e14111
- 在设置页面增加了两个功能键`全部启用`和`全部禁用`

##### 用户体验改善

- 优化搜索结果的排序，现在的排序规则是，置顶全字匹配的内容，优先显示名称匹配的内容，其次显示描述匹配的内容
  ![Snipaste_2019-04-19_21-58-45.png](https://i.loli.net/2019/04/19/5cb9d4282b7a1.png)
- 滚动条样式调整，现在滚动条会自动隐藏，并在滚动时会鼠标移至滚动条位置时出现
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



## 下载

[百度网盘](https://pan.baidu.com/s/188sFN_oktGulGTdvnCQPqw) 提取码: `yfh7`

[插件发布页](https://yuanliao.info/d/356)

## 安装方法

将`upx`文件拖入`uTools`输入框中安装即可

## 关键字

`手册设置` `linux命令` `php函数` `python库` `C函数` `vim命令` `git命令` `docker命令` `sql手册` `uToolsAPI` 等

## 手册来源

<<<<<<< HEAD
- php手册   | [官方中文文档](https://www.php.net/download-docs.php)       
- linux手册 | [离线手册：linux-command@jaywcjlove](https://github.com/jaywcjlove/linux-command)  [原始数据：linuxde.net](http://man.linuxde.net/) 
- python手册 | [官方文档一译翻译版（比官方中文翻译的要多不少）](https://yiyibooks.cn/xx/python_352/library/index.html)及其他第三方库的官方中文文档 
- C函数 | C语言函数速查（Knocker 2004.7.7 版本 0.5）
- vim命令 | [awesome-cheatsheets](https://github.com/skywind3000/awesome-cheatsheets/blob/master/editors/vim.txt) 
- git命令 | [php中文网git开发手册](http://www.php.cn/manual/view/34942.html) 
- sql手册 | [php中文网sql参考手册](http://www.php.cn/manual/view/21301.html) 
- uTools API | [uTools官方文档](https://u.tools/docs/developer/api.html) 
- java | [fondme.cn](https://blog.fondme.cn/apidoc/jdk-1.8-google/) 
- javascript | [MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Index) 
- jQuery | [jQuery中文网](https://www.jquery123.com/) 
- vue | [官方中文文档](https://cn.vuejs.org/v2/api/) 
=======
| 手册 | 来源 |
| --------- | ------------------------------------------------------------ |
| php手册   | [官方中文文档](https://www.php.net/download-docs.php)        |
| linux手册 | [离线手册：linux-command@jaywcjlove](https://github.com/jaywcjlove/linux-command)  [原始数据：linuxde.net](http://man.linuxde.net/) |
| python手册 | [官方文档一译翻译版（比官方中文翻译的要多不少）](https://yiyibooks.cn/xx/python_352/library/index.html)及其他第三方库的官方中文文档 |
| C函数 | C语言函数速查（Knocker 2004.7.7 版本 0.5） |
| vim命令 | [awesome-cheatsheets](https://github.com/skywind3000/awesome-cheatsheets/blob/master/editors/vim.txt) |
| git命令 | [php中文网git开发手册](http://www.php.cn/manual/view/34942.html) |
| sql手册 | [php中文网sql参考手册](http://www.php.cn/manual/view/21301.html) |
| uTools API | [uTools官方文档](https://u.tools/docs/developer/api.html) |
| java | [fondme.cn](https://blog.fondme.cn/apidoc/jdk-1.8-google/) |
| javascript | [MDN Web Docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Index) |
| jQuery | [jQuery中文网](https://www.jquery123.com/) |
| vue | [官方中文文档](https://cn.vuejs.org/v2/api/) |
>>>>>>> 3c522286bb5491f9d6794dc53d0ced8572e14111
