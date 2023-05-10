/**
 * 2018/8/29 下午5:27
 * 文档： https://www.npmjs.com/package/log4js
 */

import * as path from 'path'
import * as log4js from 'log4js'

function createDateLogFileName() {
  let now = new Date()
  let y = now.getFullYear()
  let m = now.getMonth() + 1
  let d = now.getDate()
  return `${y}_${m}_${d}.log`
}

log4js.configure({
  // 在运行目录下./logs/xxx.log
  appenders: {spider: {type: 'file', filename: path.resolve('./logs/', createDateLogFileName())}},
  categories: {default: {appenders: ['spider'], level: 'debug'}}
})
let logger = log4js.getLogger('spider')

logger.level = 'debug'

export default logger

export function configLogger(cb: (logger: log4js.Logger) => void) {
  cb(logger)
}
