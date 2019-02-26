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

let app = {
    count: 0,
    // 预先设置抓取任务
    addUrl(url, num) {
        factory.addBatchUrl(url, num)
    },
    // 启动爬虫
    start({saveType}) {
        return new Promise((resolve, reject) => {
            factory.createAssemblyLine((urlArr) => {
                let tasks = []
                urlArr.forEach(url => {
                    tasks.push(
                        app.init({url, saveType})
                    )
                    app.count++
                })
                Promise.all(tasks).then(res => {
                    resolve(true)
                }).catch(e => {
                    reject()
                })
            }, 1)
        })

    },
    // 单个页面的抓取任务
    init({url, saveType = 'file'}) {
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

        let handler = {
            file() {
                return new DB(fileDb)
            },
            mongo() {
                return new DB(mongoDb)
            }
        }
        let db

        if (typeof handler[saveType] === 'function') {
            db = handler[saveType]()
        } else {
            log.error(`无${saveType}类型的存储方式，请检查参数`)
            return Promise.resolve(false)
        }

        log.info(`开始抓取:${url}`)

        return sp.start().then(data => {
            log.info(`url:${url}抓取完毕, 获取数据:${data.length}`)

            return db.save(data)
        }).catch(e => {
            log.error(e)
        })
    }
}
module.exports = app

