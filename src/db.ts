/**
 * 2018/8/25 下午10:34
 * 为爬虫支持不同类型的数据存储方式
 */

import File, {FileDBConfig} from './dbEngine/file'
import Mongo, {MongoDBConfig} from './dbEngine/mongo'
import Upload, {UploadDBConfig} from './dbEngine/upload'
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

type DBBaseConfig = {
  type: 'file'
  config: FileDBConfig,
} | {
  type: 'mongo',
  config: MongoDBConfig,
} | {
  type: 'upload',
  config: UploadDBConfig,
}

export type DBConfig = DBBaseConfig & {
  format?: (data: any) => any,
}

const engineMap = {
  file: File,
  mongo: Mongo,
  upload: Upload
}

class DB {
  engine: File | Mongo | Upload
  format: (data: any) => any

  constructor(opt: DBConfig) {
    let {type, config, format} = opt

    this.format = format

    let Engine = engineMap[type]
    if (Engine) {
      this.engine = new Engine(config)
    } else {
      log.error(`找不到${type}类型的存储引擎`)
    }
  }

  // 格式化数据
  private formatData(data) {
    let {format} = this
    return format ? format(data) : data
  }

  public save(data: Array<any>) {
    log.info(`准备保存数据，总计${data.length}条`)
    const content = this.formatData(data)
    return this.engine.save(JSON.stringify(content))
  }
}


export default DB
