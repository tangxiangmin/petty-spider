/**
 * 2018/8/29 下午5:27
 * 文档： https://www.npmjs.com/package/log4js
 */

let log4js = require('log4js')
let logger = log4js.getLogger()

logger.level = 'debug'

module.exports = logger
