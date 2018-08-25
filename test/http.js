/**
 * 2018/8/25 下午9:16
 */

let assert = require("chai").assert

let http = require('../src/http')

describe.skip('http test', function(){
    it('shoule 100% pass', function(){
        assert(true === true)
    })

    it('getPageContent return Promise', function(){
        let url = 'test'
        let res = http.getPageContent(url)

        assert(res.then)
    })
})