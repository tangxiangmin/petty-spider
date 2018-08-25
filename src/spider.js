/**
 * 2018/8/23 下午11:04
 */

let cheerio = require('cheerio')
let apiModel = require('./http')
let DB = require('./db/index')

class Spider {
    constructor(config) {
        let {db} = config

        this.config = config

        this.db = new DB(db)
    }

    start() {
        this.getPageHtml().then(html => {
            let result = this.parse(html)
            let data = this.handleResult(result)

            this.save(data)
        })
    }

    getPageHtml() {
        let {url} = this.config
        return apiModel.getPageContent(url)
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
        // 过滤掉异常的asin值
        let result = []
        data.forEach((item) => {
            item = item.trim()
            if (item.length) {
                result.push(item)
            }
        })
        return result
    }

    save(data) {
        this.db.save(data)
    }

    getStrategy() {
        let {strategy} = this.config
        return strategy || []
    }
}

module.exports = Spider