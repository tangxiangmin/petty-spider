/**
 * 2018/8/25 下午10:34
 * 为爬虫支持不同类型的数据存储方式
 */

import File from './dbEngine/file'
import Mongo from './dbEngine/mongo'
import Upload from './dbEngine/upload'
import log from './log'

// 不同的config配置参数模式
// let fileDb = {
//     type: 'file', // 指定存储类型
//     config: {
//         dist: path.resolve(__dirname, `./tmp/${this.count}.json`),
//         format(data) {
//             return JSON.stringify(data)
//         },
//     },
// }

// let mongoDb = {
//     type: 'mongo',
//     config: {
//         host: 'mongodb://localhost/shymean',
//         document: 'joke',
//         schema: {
//             content: String
//         },
//     }
// }

class DB {
    type: string
    config: any // todo 定义config类型
    engine: File | Mongo | Upload

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
        let engineMap = {
            file: File,
            mongo: Mongo,
            upload: Upload
        }

        let Engine = engineMap[type] || defaultEngine
        if (Engine) {
            this.engine = new Engine(config)
        } else {
            log.error(`找不到${type}类型的存储引擎`)
        }
    }

    // 格式化数据
    formatData(data) {
        let {format} = this.config
        return format ? format(data) : data
    }

    save(data) {
        log.info(`准备保存数据，总计${data.length}条`)
        let content = this.formatData(data)
        return this.engine.save(content)
    }
}


export default DB
