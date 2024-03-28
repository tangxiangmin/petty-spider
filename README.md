petty-spider
===

处于个人兴趣编写的一个精简的爬虫工具，满足日常的爬取需求。


## 开发文档

### 将网络请求交给用户

实际上的抓取请求有各种情况，除了最基础的get请求url，还包括
* get、post请求混用，通过js触发表单post提交页面
* 各种请求返回各不相同，比如HTML、JSON，以及不同的页面编码等，在框架代码中封装不太合适
* 有时候希望在请求前后插入一些特定的逻辑，以及用户鉴权等信息，如果通过配置项添加、使用成本较高

所以为了减少学习成本，将整个请求的逻辑交给用户，只需实现一个`request(url)`的方法，该方法返回结果为`Promise.resolve(html)`

### 缓存调试

在进行爬虫开发时，往往需要经历各种调试和测试，频繁请求源站数据并不是特别好的行为。因此需要实现缓存源站数据的功能。

### 日志

需要在核心节点打日志，在自动化的过程中有迹可循。

## 使用：单个页面的爬取流程

总体来说，爬虫分为下面三个部分 
* 获取页面数据
* 解析页面数据
* 保存数据

下面演示了抓取微博热搜排行榜的整体历程
```ts
const sp = new Spider({
  key: 'weibo_hot_search',
  cache: false, 
  json: true,
  async request() {
    const { data } = await axios.get('https://weibo.com/ajax/side/hotSearch')
    return data as {
      data: {
        realtime: {
          is_new: number
          category: string
          word_scheme: string
        }[]
      }
    }
  },
  async parse(data) {
    // 会自动推断request函数的类型
    const list = data.data.realtime.filter((row) => row.category?.includes('社会新闻'))
    return list.map((row) => `https://s.weibo.com/weibo?q=${row.word_scheme.replaceAll('#', '%23')}`)
  },
  save(data) {
    // 会自动推断出parse函数的返回值
    return saveInFile(resolve(__dirname, './output/weibo.txt'), data)
  },
})

sp.work()
```
下面是抓取某个HTML页面的示例
```ts
async function request(url: string) {
  const res = await http.get(url, {
    responseType: 'arraybuffer',
  })
  return decode(res.data, 'gbk')
}
const sp = new Spider({
  cache: true,
  key: 'novel',
  json: false,
  async request() {
    const res = await http.get(`${host}index.html`, {
      responseType: 'arraybuffer',
    })
    return decode(res.data, 'gbk') // 可以自定处理编码等问题
  },
  async parse(data) {
    return parseHTMLResponse(data, {
      articles: {
        selector: '.uclist dd a',
        list: true,
        parse($dom) {
          const title = $dom.text()
          const url = $dom.attr('href')
          return {
            title,
            url: `${host}${url}`,
          }
        },
      },
    })
  },
  async save(data) {
    return saveInFile(resolve(__dirname, './output/2.txt'), data)
  },
})
```

sp的构造参数包括
* key: string, 每个爬虫的唯一id，在日志、缓存等地方会使用
* cache: bool，是否需要缓存原始响应到本地，每次都走网络请求，在测试期间打开可以方便调试
* json: bool，request响应是否是json，由于涉及到缓存，这里需要手动指定，方便从缓存恢复时符合期望的数据
* request: () => Promise<R>, 请求函数，R是html字符串或者任何JSON类型
* parse: (data: R) => Promise<P>，解析内容函数，参数是request的返回值，会自动推断类型
* save: (data: P) => Promise<void>，保存函数，参数是parse函数的返回值，会自动推断类型

### 获取页面数据

在部分需要获取用户信息的路由中，需要进行用户账号密码登录，后续请求才会携带对应的身份信息。具体实现思路有两种
* 手动在网站上登录，并直接复制对应的请求返回值，通过配置形式注入
* 抓包，分析登录请求及返回值，调用登录接口进行登录，建议这种

在其他不需要登录的页面上，这一步不是必须的。

准备工作完成之后，只需要发送http请求即可获取页面数据。可以选用任何你喜欢的node网络请求工具，这里推荐axios

### 解析页面数据

如果是JSON类型的request，则直接处理JSON对象即可。

如果是HTML类型的request，使用[`cherrio`](https://github.com/cheeriojs/cheerio)解析HTML。

cherrio与jQuery的用法基本一致，可以直接在Node.js环境直接运行
```ts
async function parse(data: string) {
  return parseHTMLResponse(data, {
    articles: {
      selector: '.uclist dd a',
      list: true,
      parse($dom) {
        const title = $dom.text()
        const url = $dom.attr('href')
        return {
          title,
          url: `${host}${url}`,
        }
      },
    },
  })
}
```

`parseHTMLResponse`接收的是一个html字符串和需要解析的节点策略，内部会依次运行每个配置的parse函数，并将解析结果挂载到返回值的同名key上面。

同一个页面可以配置多个策略，最后会将收集到的数据汇总到一起，进行保存。

### 保存

数据的保存有多种方式，框架封装了

文件保存`saveInFile`

```ts
saveInFile(resolve(__dirname, './output/weibo.txt'), data)
```

mongodb保存, TODO
```js
saveInMongoDB(data)
```

也可以在`save`钩子中自定义处理，比如抓取到了一堆表情包图片，需要下载url保存到本地磁盘上，可以使用内置的`downloadMedia`
```ts
async function save(data) {
  for (const row of data.images) {
    const filePath = resolve(__dirname, './output/', `${row.name}.jpg`)
    await downloadMedia(filePath, async () =>
      axios({
        method: 'get',
        url: row.src,
        responseType: 'stream',
        headers: {
          // ....
        },
      })
    )
  }
}
```

## 多个页面的爬取流程

多个页面的爬取，不单单是遍历url数组，重复爬取单个页面的数据，还需要考虑下面问题：
* 检测页面是否重复爬取
* 控制并发，兼顾效率与安全性
* 登录信息的过期
* 自动化
* 异常处理与进入监控等
* IP代理

一步一步完善吧~


