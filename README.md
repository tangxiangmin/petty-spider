mini-spider
===

一个精简的爬虫工具，满足日常的爬取需求


## 特性
* [ ] 通过配置文件，快速抓取数据
* [ ] 并发请求、消息队列、自动登录


## 使用
// todo 暂时参考index.js

## 单个页面的爬取流程
> 写爬虫的经验比较少，这里整理一下自己的思路，在整个工具的编写过程中需要不断修正。

总体来说，爬虫分为下面四个部分
* 模拟登录（这一步不是必须的）
* 获取页面数据
* 解析页面数据
* 保存数据

每个步骤都对应了一个类用于处理相关流程的工作
```js
let auth = auth.login()

let sp = new Spider({
    auth,
    // some spider config
})
let db = new DB({
    // some db config
})

sp.start().then(data => {
    db.save(data)
})
```


### 模拟登录
在部分需要获取用户信息的路由中，需要进行用户账号密码登录，后续请求才会携带对应的身份信息。具体实现思路有两种
* 手动在网站上登录，并直接复制对应的请求返回值，通过配置形式注入
* 抓包，分析登录请求及返回值，调用登录接口进行登录，建议这种

在其他不需要登录的页面上，这一步不是必须的。

### 获取页面数据
发送http请求即可，如果需要登录，则需要修改请求头并携带用户身份信息。

node端也有很多不错的请求工具，目前暂时使用的是`axios`

### 解析页面数据
根据http响应，解析html文档，获取对应的dom节点数据。这里使用`cheerio`解析文档，由于不同的页面解析方式不同，此处需要进行策略配置，每个页面的`strategy`对象是一个数组，包含选择器和对应选择器匹配节点的解析模式。
```
[{
    selector: '.article .contentHerf',
    parse($dom) {
        // 这里处理对应的数据格式
        return {
            content: $dom.text()
        }
    },
}]
```
同一个页面可以配置多个策略，最后会将收集到的数据汇总到一起，进行保存

### 保存
数据的保存有多种方式，暂时支持文件保存和mongodb保存。

文件保存
```js
let file = {
    type: 'file', // 指定存储类型
    config: {
        dist: path.resolve(__dirname, './tmp/1.json'),
        format(data) {
            return JSON.stringify(data)
        },
    },
}
```

mongodb保存
```js
let mongo = {
    type: 'mongo',
    config: {
        host: 'mongodb://localhost/shymean',
        document: 'joke',
        schema: {
            content: String
        },
    }
}
```
在`DB`构造函数中，通过`type`指定存储引擎，然后在`config`中传入对应的配置参数即可

## 多个页面的爬取流程
多个页面的爬取，不单单是遍历url数组，重复爬取单个页面的数据，还需要考虑下面问题：
* 检测页面是否重复爬取
* 控制并发，兼顾效率与安全性
* 登录信息的过期
* 自动化
* 异常处理与进入监控等

一步一步完善吧~


