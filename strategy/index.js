/**
 * tangxiangmin@cd.tuan800.com
 * 2018/8/30 上午8:48
 */


let urlStrategy = require('../src/strategy')

class Strategy extends urlStrategy {
    constructor(props) {
        super(props);
        this.setDefaultPage()
    }

    // 内置默认的解析策略
    setDefaultPage() {
        let qiushi = require('./qiushi')
        let laifu = require('./laifu')
        let arr = [].concat(qiushi, laifu)

        for (let i = 0; i < arr.length; ++i) {
            let stat = arr[i]
            this.addPage(stat)
        }
    }
}

module.exports = Strategy
