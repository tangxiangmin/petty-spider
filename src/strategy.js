/**
 * 2018/8/30 上午8:48
 */


class UrlStrategy {
    constructor() {
        this.pages = []
    }

    static match(expected, actual = '') {
        if (typeof expected === 'string') {
            return expected.toLowerCase() === actual.toLowerCase()
        }

        if (expected instanceof RegExp) {
            return expected.test(actual)
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

            if (UrlStrategy.match(rtype, url)) {
                return strategy
            }
        }
    }
}

module.exports = UrlStrategy
