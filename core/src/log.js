/**
 * 2018/8/29 下午5:27
 * 文档： https://www.npmjs.com/package/log4js
 */

let log4js = require('log4js')
log4js.configure({
    appenders: {school: {type: 'file', filename: 'school.log'}},
    categories: {default: {appenders: ['school'], level: 'debug'}}
})
let logger = log4js.getLogger('school')

logger.level = 'debug'

module.exports = logger
