/**
 * 2018/8/25 下午10:34
 * 为爬虫支持不同类型的数据存储方式
 */

let File = require('./file')
let Mongo = require('./mongo')

let util = require('../util')
let log = require('../log')

class DB {
    constructor(opt) {
        let {type, config, format} = opt

        this.type = type
        this.config = config

        this.engine = null

        this.setEngine(type)
    }

    // 设置数据存储方式，对象对外暴露save(data)接口即可
    setEngine(type, defaultEngine = null) {
        let {config} = this
        let Engine = defaultEngine

        if (type === 'file') {
            Engine = File
        } else if (type === 'mongo') {
            Engine = Mongo
        }

        if (Engine) {
            this.engine = new Engine(config)
        } else {
            log.error(`找不到${type}类型的存储引擎`)
        }
    }

    // 格式化数据
    formatData(data) {
        let {format} = this.config
        if (util.isFunc(format)) {
            return format(data)
        } else {
            return data
        }
    }

    save(data) {
        log.info(`准备保存数据，总计${data.length}条`)

        let content = this.formatData(data)

        // log.info(`准备保存数据，总计${data.length}条`)

        return this.engine.save(content)
    }
}

module.exports = DB