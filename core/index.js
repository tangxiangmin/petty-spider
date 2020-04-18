/**
 * 2018/8/25 下午9:05
 */
let path = require('path')
let log = require('./src/log')

let Spider = require('./src/spider')
let DB = require('./src/db')
let UrlFactory = require('./src/urlFactory')
let Strategy = require('./strategy/index')

class App {
    constructor() {
        this.factory = new UrlFactory()
        this.urlStrategy = new Strategy()
        this.count = 0
    }

    // 预先设置抓取任务
    addUrl(url, num = 1) {
        this.factory.addBatchUrl(url, num)
    }

    addStrategy(config) {
        this.urlStrategy.addPage(config)
    }

    start(opts) {
        return new Promise((resolve, reject) => {
            this.factory.createAssemblyLine((urlArr) => {
                let tasks = []
                urlArr.forEach(url => {
                    tasks.push(
                        this.init({...opts, url,})
                    )
                    this.count++
                })
                Promise.all(tasks).then(res => {
                    resolve(true)
                }).catch(e => {
                    reject(e)
                })
            }, 1, 500)
        })
    }

    // 单个页面的抓取任务
    init({url, saveConfig, request}) {
        let strategy = this.urlStrategy.getPageStrategy(url)
        let sp = new Spider({
            url,
            // 单个页面的爬取区域
            strategy,
            request
        })

        let db = new DB(saveConfig)
        log.info(`开始抓取:${url}`)

        return sp.start().then(data => {
            log.info(`url:${url}抓取完毕, 获取数据:${data.length}`)
            return db.save(data)
        }).catch(e => {
            log.error(e)
            throw e
        })
    }
}

module.exports = App

