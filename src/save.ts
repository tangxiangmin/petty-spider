import * as fs from 'fs-extra'
import mongoose from 'mongoose'

// 保存到本地文件
export async function saveInFile(dist: string, data: string | any[] | object) {
  if (['array', 'object'].includes(typeof data)) {
    data = JSON.stringify(data, null, 2) // 格式化
  }
  await fs.ensureFile(dist)
  await fs.appendFile(dist, `${data}\n`, 'utf-8')
}

// 保存到mongoDB
let mongooseModel: mongoose.Model<any> | undefined
type MongoDBConfig = { host: string; schema: object; document: string; model: any }

export async function initMongooseInstance(mongoDBConfig: MongoDBConfig) {
  return new Promise((resolve, reject) => {
    if (!mongoDBConfig) {
      reject(new Error('globalConfig.mongoDBConfig未配置'))
      return
    }

    const { schema, host, document } = mongoDBConfig

    mongoose.connect(host, { useNewUrlParser: true })
    const connect = mongoose.connection
    connect.on('error', (err) => {
      if (err) {
        reject(err)
      }
    })
    connect.once('open', () => {
      resolve(true)
    })
    const Schema = mongoose.Schema
    mongooseModel = mongoose.model(document, new Schema(schema))
  })
}

export async function saveInMongoDB<T>(data: any[]): Promise<void> {
  const Model = mongooseModel
  if (!Model) return
  const tasks: any[] = []
  data.forEach((item) => {
    const row = new Model(item)
    const handler = row.save()
    tasks.push(handler)
  })

  await Promise.all(tasks)
}

export async function closeMongoDB(): Promise<void> {
  return mongoose.disconnect()
}

// 还有一种场景是通过接口提交到其他服务器上面，直接使用网络请求
