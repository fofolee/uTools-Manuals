# 外置手册

本次更新一个主要功能就是添加自定义添加手册的功能。一方面随着手册的增加，插件的体积会不断增大，使得插件本身变得臃肿，同时将数据和界面分离，方便后期维护；另一方面个人精力、资源都有限，无法满足所有人需求，增加这个功能，大家可以一起来维护，如果你有好的手册，欢迎发送给我[fofolee@qq.com](mailto:fofolee@qq.com)，我会添加到内置或者外置的手册库中，并标明贡献者。

闲话少说，下面进入正题

以下均以外置手册`Java`为例

## 配置格式

增加外置手册需要填写的参数如下图所示

![Snipaste_2019-04-20_10-45-20.png](https://i.loli.net/2019/04/20/5cba8859b3a66.png)

- `名称`是这个手册的唯一标识，类似于`uTools`插件开发中的`code`，手册中的大部分配置文件都以此命名，建议以语言的英文名称命名（如果不和已有的内置手册冲突的话）
- `关键字`是进入手册的关键词，多个以逗号隔开
- `说明`手册描述
- `路径`手册所在路径

## 手册格式

外置手册所在目录内应具备如下几个文件

![Snipaste_2019-04-20_11-26-25.png](https://i.loli.net/2019/04/20/5cba916719042.png)

可以看到，所有文件的名称几乎都是以之前配置中的`名称`命名的

- xxx.json 必须具备的文件，是整个手册的目录文件
- xxx文件夹 必须具备的文件，整个手册的主体就在这个文件夹里了
- xxx.png 非必备文件，在配置页面显示手册的图标，本来也作为这个手册在`uTools`主输入框的logo文件，但遗憾的是貌似`uTools`的logo文件不支持绝对路径，希望官方能够解决一下~
- xxx.css 非必备文件，手册的css样式文件

## 手册文件夹

手册文件夹内包含了所有手册的文件，获取途径不外乎有两种

- 如果官方提供了下载，直接下载，例如`php`

- 官方没有提供下载，用脚本爬取

  以爬取[https://blog.fondme.cn/apidoc/jdk-1.8-google](https://blog.fondme.cn/apidoc/jdk-1.8-google)的`java`文档为例，我使用的是`python`脚本，当然你可以使用任何你喜欢的语言

```python
import requests
from bs4 import BeautifulSoup 
import os
import sys

for i in range(1,28):
    url = "https://blog.fondme.cn/apidoc/jdk-1.8-google/index-files/index-%d.html"%i
    r=requests.get(url).content
    soup = BeautifulSoup(r).select('dt')
    for n, x in enumerate(soup):
        path = x.a.attrs['href']
        if '#' not in path:
            file = path[3:]
            url = "https://blog.fondme.cn/apidoc/jdk-1.8-google/index-files/" + path
            r = requests.get(url).content
            sou = BeautifulSoup(r).select('.header,.contentContainer')
            d = os.path.dirname(file)
            if not os.path.exists(d):
                os.makedirs(d)
            with open(file, 'w') as f:
                f.write(str(sou[0])+str(sou[1]))
        sys.stdout.write('\r[%d/%d/%d] %s done!'%(n, len(soup), i, file))
```

当然，你还可以使用`网站镜像`的软件或者`wget`进行递归下载，但是个人还是比较建议使用爬虫脚本，如果你仔细看了脚本的话，会发现这段代码

```python
sou = BeautifulSoup(r).select('.header,.contentContainer')
```

即在爬取网页时，只爬取了文档的主体内容，一些无关的内容（如侧栏、底栏等）没进行爬取，这样可以节省`uTools`这种小窗口的空间，同时整个手册也更加整洁。

值得注意的是，`<head>`标签内的内容也没爬取，因为在插件中内置了一个通用的`css`样式，如果效果不理想，你可以在外置手册目录中再额外放置一个`css`文件即可，并且无须在每个文档的`html`文件中引入，会通过插件自动加载

## 目录文件

目录文件是数组格式的`json`文件，数组的每一个值对应着一个函数、目录或者文档，如

```json
{
	"name": "Cipher(CipherSpi, Provider, String)",
	"type": "Cipher",
	"path": "java/javax/crypto/Cipher.html#Cipher-javax.crypto.CipherSpi-java.security.Provider-java.lang.String-",
	"desc": "从OutputStream和Cipher构造一个CipherOutputStream"
}
```

各个键值对应如下，其中`type`和`desc`可以留空

![Snipaste_2019-04-20_11-39-11.png](https://i.loli.net/2019/04/20/5cba9469a113d.png)

## 生成目录文件

生成目录文件一样需要使用脚本，同样以https://blog.fondme.cn/apidoc/jdk-1.8-google](https://blog.fondme.cn/apidoc/jdk-1.8-google)的`java`文档为例

```python
import codecs
import requests
from bs4 import BeautifulSoup 
import os
import sys

j = codecs.open('java.json', 'a' ,encoding='utf-8')
j.write("[")
for i in range(1,28):
    url = "https://blog.fondme.cn/apidoc/jdk-1.8-google/index-files/index-%d.html"%i
    r=requests.get(url).content
    soup = BeautifulSoup(r).select('dt')
    soup2 = BeautifulSoup(r).select('dd')
    for x,y in zip(soup,soup2):
        name = x.a.text
        path = 'java' + x.a.attrs['href'][2:]
        type = x.a.attrs['href'].split('/')[-1].split('.html#')[0]
        desc = y.text.replace('\n','').replace('"','&quot;')
        j.write('{"name":"%s","type":"%s","path":"%s","desc":"%s"},'%(name,type,path,desc))
        sys.stdout.write('\r[%d/%d/%d] %s done!'%(soup.index(x), len(soup), i, name))
j.write("]")
j.close()
```

## 关于DASH、ZEAL

考虑再三，就不内置转换`dash`和`zeal`文档的功能了，简单提供一个方法

`dash`或`zeal`的离线文档目录一般在`Resources`文件夹下，这个文件夹内以下几个文件值得关注：

- Documents 文档主体
- docSet.dsidx `sqlite3`格式的目录文件
- Tokens.xml `xml`格式的目录文件

`Tokens.xml`文件不是每个文档都有，当有`Tokens.xml`文件时，使用以下`nodejs`脚本将其转成本插件可用的目录文件

```js
const fs = require('fs');

xml2Json = (input, output) => {
    fs.readFile(input, 'utf8', (err, data) => {
        data = data.replace(/\"/g, "&quot;");
        data = data.replace(/<Token>.*?<Name>(.*?)<\/Name><Type>(.*?)<\/Type>.*?<Path>(.*?&gt;)*(.*?)<\/Path>\s+.*?<\/Token>/g, `{"name":"$1","type":"$2","path":"$4"},`);
        data = data.replace(/<\?xml.*?>\s+<Tokens.*?>([\s|\S]*?),\s+<\/Tokens>/, '[$1]');
        fs.writeFile(output, data, 'utf8', err => {
            err && console.log(err);
        })
    })
}

xml2Json('Tokens.xml', 'xxx.json')
```

当没有`Tokens.xml`文件时，使用以下`nodejs`脚本将`docSet.dsidx`转换为本插件可用的目录文件

```js
const sqlite3 = require('sqlite3');
const fs = require('fs');

sqlite2Json = (input, output) => {
    let db = new sqlite3.Database(input);
    var json = {}
    db.all(`SELECT * FROM searchIndex`, function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
        for (var d of data) {
            json[d.name] = d
        }
        fs.writeFile(output, JSON.stringify(json), err => {
            err && console.log(err);
        })
    })
}

sqlite2Json('docSet.dsidx', 'xxx.json')
```

需要先安装`sqlite3`模块

```sh
npm i sqlite3
```

