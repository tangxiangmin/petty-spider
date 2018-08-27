/**
 * 2018/8/23 下午11:04
 * 解析页面逻辑
 */

let cheerio = require('cheerio')
let util = require('./util')
let http = require('./http')

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
        return this.getPageHtml().then(html => {
            let result = this.parse(html)
            let data = this.handleResult(result)
            return data
        })
    }

    getPageHtml() {
        let {url} = this.config
        return http.getPageContent(url)
    }

    parse(html) {
        let $ = cheerio.load(html);
        let strategy = this.getStrategy()

        let result = []
        strategy.forEach(strat => {
            let {selector, parse} = strat
            let $dom = $(selector)

            if (typeof parse === 'function') {
                $dom.each(function () {
                    let $this = $(this)
                    let res = parse($this)
                    result.push(res)
                })
            }
        })

        return result
    }

    handleResult(data) {
        let {filter} = this.config
        let result = []
        data.forEach((item) => {
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