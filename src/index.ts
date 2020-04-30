/// <reference path="./global.d.ts" />

import log from './log'
import http from './http'
import DB from './db'
import Strategy from './strategy'
import Spider from './spider'

type Task = PettySpider.SpiderTask


const defaultHooks = {
    afterEach: (task: Task, next: Task) => {
    }
}

class App {

    urlStrategy: Strategy;
    config: Object;
    tasks: Array<Task>

    constructor() {
        this.urlStrategy = new Strategy()
        this.config = {}
        this.tasks = []
    }

    // 验证task格式是否正确
    _validTask(task: Task) {
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
    addTask(task: Task) {
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
            },
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

export default App

// 暴露一些工具方法
const sleep = (ms) => {
    if (!ms) {
        ms = Math.random() * 3000 + 3000
    }
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export {
    http,
    log,
    sleep
}
