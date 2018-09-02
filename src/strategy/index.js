/**
 * tangxiangmin@cd.tuan800.com
 * 2018/8/30 上午8:48
 */

let qiushi = require('./qiushi')

class urlStrategy {
    constructor() {
        this.pages = []

        this.setDefaultPage()
    }

    static match(expected, actual = '') {
        if (typeof expected === 'string') {
            return expected.toLowerCase() === actual.toLowerCase()
        }

        if (expected instanceof RegExp) {
            return expected.test(actual)
        }
    }

    // 内置默认的解析策略
    setDefaultPage() {
        for (let i = 0; i < qiushi.length; ++i) {
            let stat = qiushi[i]
            this.addPage(stat)
        }
    }

    addPage(page) {
        // 每一个page对象包含一个rtype和strategy属性
        this.pages.push(page)
    }

    // 获取对应url的解析策略
    getPageStrategy(url) {
        let pages = this.pages
        for (let i = 0; i < pages.length; ++i) {
            let page = pages[i]
            let {rtype, strategy} = page

            if (urlStrategy.match(rtype, url)) {
                return strategy
            }
        }
    }
}

module.exports = urlStrategy
