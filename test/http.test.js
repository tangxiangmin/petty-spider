/**
 * 2018/8/25 下午9:16
 */

let assert = require("chai").assert

let httpTest = require('../src/http')

describe.skip('http test', function(){
    it('shoule 100% pass', function(){
        assert(true === true)
    })

    it('getPageContent return Promise', function(){
        let url = 'test'
        let res = httpTest.getPageContent(url)

        assert(res.then)
    })
})
