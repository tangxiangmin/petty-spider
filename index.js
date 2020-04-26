/**
 * 2018/8/25 下午9:05
 */
let log = require('./src/log')
let http = require('./src/http')

let Spider = require('./src/spider')
let DB = require('./src/db')
let Strategy = require('./src/strategy')

const noop = () => {
}

const defaultHooks = {
    afterEach: noop
}

class App {

    constructor() {
        this.urlStrategy = new Strategy()
        this.config = {}
        this.tasks = []
    }

    // 验证task格式是否正确
    // todo 重构为TS
    _validTask(task) {
        return task && (typeof task.url === 'string') && (typeof task.request === 'function')
    }

    // 添加抓取策略
    addStrategy(strategy) {
        this.urlStrategy.addPage(strategy)
    }

    // 添加配置
    addConfig(config) {
        // todo 校验config参数
        this.config = config
    }

    // 创建一个抓取任务
    createTask(startUrl, request) {
        if (!request) {
            request = function (api) {
                return api({url: startUrl})
            }
        }
        return {
            url: startUrl,
            request
        }
    }

    // 添加一个抓取任务
    addTask(task) {
        if (!this._validTask(task)) throw `app.addTask：task参数类型错误`
        this.tasks.push(task)
    }

    /**
     *
     * @param mode 指定config类型
     * @param hooks，任务钩子函数配置项
     * @returns {Promise<void>}
     */
    async start(mode, hooks = defaultHooks) {
        let modeConfig = this.config && this.config[mode]
        if (!modeConfig) throw `app.start: 未指定${mode}类型配置，请先调用addConfig添加`

        // todo 同时抓取多个任务
        let {tasks} = this
        while (tasks.length) {
            let task = tasks.shift()
            if (!this._validTask(task)) continue

            await this.initSpider(modeConfig, task)

            let next = tasks[0] // 下一个待抓取的任务
            await hooks.afterEach(task, next)
        }
    }

    // 单个页面的抓取任务
    initSpider({saveConfig, request}, task) {
        let {url} = task
        let strategy = this.urlStrategy.getPageStrategy(url)
        let sp = new Spider({
            // 单个页面的爬取区域
            strategy,
            request: () => {
                return task.request(request)
            }
        })

        let db = new DB(saveConfig)
        log.info(`开始抓取:${url}`)

        return sp.start().then(data => {
            log.info(`url:${url}抓取完毕, 获取数据:${data.length}`)
            return db.save(data)
        }).catch(e => {
            log.error('页面抓取失败', e)
            throw e
        })
    }
}

App.http = http
App.log = log

module.exports = App

