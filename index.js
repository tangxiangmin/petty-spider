/**
 * 2018/8/25 下午9:05
 */

let Spider = require('./src/spider')
let path = require('path')

let sp = new Spider({
    url: 'https://www.qiushibaike.com/',

    db: {
        type: 'file',
        config: {
            dist: path.resolve(__dirname, './tmp/1.txt'),
        }
    },
    strategy: [{
        selector: '.article .contentHerf',
        parse($dom) {
            return $dom.text()
        },
    }]
})

sp.start()