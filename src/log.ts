/**
 * 2018/8/29 下午5:27
 * 文档： https://www.npmjs.com/package/log4js
 */

import * as log4js from 'log4js'
import { resolve } from 'path'
import { globalConfig } from './config'

function createDateLogFileName() {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const d = now.getDate()

  return `${y}_${m}_${d}.log`
}

log4js.configure({
  appenders: {
    spider: { type: 'file', filename: resolve(globalConfig.logPath, createDateLogFileName()) },
  },
  categories: { default: { appenders: ['spider'], level: 'debug' } },
})
const logger = log4js.getLogger('spider')

logger.level = 'debug'

export default logger
