/**
 * 2018/8/25 下午9:05
 */
let path = require('path')
let log = require('./src/log')

let Spider = require('./src/spider')
let DB = require('./src/db')
let factory = require('./src/urlFactory')
let Strategy = require('./strategy/index')

let urlStrategy = new Strategy()

// 模拟url
function addQiushiUrl() {
    factory.addBatchUrl('https://www.qiushibaike.com/8hr/page/${i}/', 10)
    factory.addBatchUrl('https://www.qiushibaike.com/text/page/${i}/', 10)
    factory.addBatchUrl('https://www.qiushibaike.com/hot/page/${i}/', 10)
}

function addLaifuUrl() {
    factory.addBatchUrl('http://www.laifudao.com/wangwen/youmoxiaohua_${i}.htm', 990)
}

// addQiushiUrl()
// addLaifuUrl()

let app = {
    count: 0,
    init(url) {
        let strategy = urlStrategy.getPageStrategy(url)
        let sp = new Spider({
            url,
            // 单个页面的爬取区域
            strategy,
            // 对单条数据的过滤
            filter(result) {
                // 剔除长度小于5的数据
                let content = result.content.trim()
                result.content = content
                return content.length > 5
            },
        })

        let fileDb = {
            type: 'file', // 指定存储类型
            config: {
                dist: path.resolve(__dirname, `./tmp/${this.count}.json`),
                format(data) {
                    return JSON.stringify(data)
                },
            },
        }

        let mongoDb = {
            type: 'mongo',
            config: {
                host: 'mongodb://localhost/shymean',
                document: 'joke',
                schema: {
                    content: String
                },
            }
        }

        let db = new DB(mongoDb)
        // let db = new DB(fileDb)
        sp.start().then(data => {
            console.log(`url:${url}, data.length:${data.length}`)
            db.save(data)
        })
    }
}

// let url = 'https://www.qiushibaike.com/'

factory.createAssemblyLine((urlArr) => {
    urlArr.forEach(url => {
        app.init(url)
        app.count++
    })
}, 1)
