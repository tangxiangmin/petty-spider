/**
 * 2018/8/25 下午9:05
 */

let Spider = require('./src/spider')
let path = require('path')

let sp = new Spider({
    url: 'https://www.qiushibaike.com/',
    // 单个页面的爬取区域
    strategy: [{
        selector: '.article .contentHerf',
        parse($dom) {
            // 这里处理对应的数据格式
            return {
                content: $dom.text()
            }
        },
    }],
    // 对单条数据的过滤
    filter(result) {
        // 剔除长度小于5的数据
        let content = result.content.trim()
        result.content = content
        return content.length > 5
    },
    // 指定存储类型
    db: {
        type: 'file',
        config: {
            dist: path.resolve(__dirname, './tmp/1.json'),
            format(data) {
                return JSON.stringify(data)
            },
        },
    },
})

sp.start()