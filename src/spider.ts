/**
 * 2018/8/23 下午11:04
 * 解析页面逻辑
 */
import SingleStrategy = PettySpider.SingleStrategy;


let cheerio = require('cheerio')
import log from './log'

// 默认过滤函数
let defaultFilter = _ => {
    return true
}

class Spider {
    config: { request: Function, filter: Function, strategy: Array<PettySpider.SingleStrategy> }

    constructor(config) {
        this.setDefaultConfig(config)
        this.config = config
    }

    setDefaultConfig(config) {
        let {filter} = config


        if (!filter) {
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

    parse(response) {
        let strategy = this.getStrategy()
        let result = []

        strategy.forEach(({selector, json, parse}: SingleStrategy) => {
            try {
                if (json) {
                    parseJSON(parse)
                } else {
                    parseHTML(selector, parse)
                }
            } catch (e) {
                log.error('parse 解析失败', e)
            }
        })

        return result

        function formatParseResult(res) {
            // 如果在解析函数中对数据进行拆分，则拼接数组
            if (Array.isArray(res)) {
                result = result.concat(res)
            } else if (res) {
                result.push(res)
            }
        }

        // 解析JSON响应，处理直接抓取接口的形式
        function parseJSON(parse) {
            let res = parse(response)
            formatParseResult(res)
        }

        // 解析HTML响应
        function parseHTML(selector, parse) {
            let $ = cheerio.load(response);
            let $dom = $(selector)

            $dom.each(function () {
                let $this = $(this)
                let res = parse($this, $)


                formatParseResult(res)
            })
        }
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

export default Spider
