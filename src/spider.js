/**
 * 2018/8/23 下午11:04
 * 解析页面逻辑
 */

let cheerio = require('cheerio')
let util = require('./util')
let log = require('./log')

class Spider {
    constructor(config) {
        this.setDefaultConfig(config)
        this.config = config
    }

    setDefaultConfig(config) {
        let {filter} = config

        // 默认过滤函数
        let defaultFilter = _ => {
            return true
        }

        if (!util.isFunc(filter)) {
            config.filter = defaultFilter
        }
        return config
    }

    start() {
        let {request} = this.config
        return request().then(html => {
            let result = this.parse(html)
            return this.handleResult(result)
        }).catch(e => {
            log.error('抓取任务报错', e)
        })
    }

    // todo 处理直接抓取接口的解析
    parse(html) {
        let $ = cheerio.load(html);
        let strategy = this.getStrategy()

        let result = []
        strategy.forEach(({selector, parse}) => {
            let $dom = $(selector)

            if (typeof parse === 'function') {
                $dom.each(function () {
                    let $this = $(this)
                    let res = parse($this, $)

                    // 如果在解析函数中对数据进行拆分，则拼接数组
                    if (Array.isArray(res)) {
                        result = result.concat(res)
                    } else if (res) {
                        result.push(res)
                    }
                })
            }
        })

        return result
    }

    handleResult(data) {
        let {filter} = this.config
        let result = []
        Array.isArray(data) && data.forEach((item) => {
            if (filter(item)) {
                result.push(item)
            }
        })
        return result
    }

    getStrategy() {
        let {strategy} = this.config
        return strategy || []
    }
}

module.exports = Spider
