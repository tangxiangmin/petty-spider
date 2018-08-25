/**
 * 2018/8/25 下午10:34
 * 为爬虫支持不同类型的数据存储方式
 */

let File = require('./file')

class DB {
    constructor(opt) {
        let {type, config} = opt

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
        }

        if (Engine) {
            this.engine = new Engine(config)
        } else {
            console.log(`找不到${type}类型的存储引擎`)
        }
    }

    save(data) {
        this.engine.save(data)
    }
}

module.exports = DB