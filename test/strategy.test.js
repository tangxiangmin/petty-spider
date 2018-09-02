/**
 * 2018/9/2 下午11:31
 */

let assert = require("chai").assert
let Strategy = require('../src/strategy')

describe('strategy test', function () {
    it('shoule 100% pass', function () {
        assert(true === true)
    })

    it('strategy.getPageStrategy应该返回对应url的配置对象', function () {
        let url = `https://www.qiushibaike.com/hot/page/${1}/`
        let strategy = new Strategy()
        let res = strategy.getPageStrategy(url)

        assert.isArray(res)
    })
})
