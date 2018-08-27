/**
 * 2018/8/25 下午9:05
 */
let path = require('path')

let Spider = require('./src/spider')
let DB = require('./src/db/index')

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
})

let fileDb = {
    type: 'file', // 指定存储类型
    config: {
        dist: path.resolve(__dirname, './tmp/1.json'),
        format(data) {
            return JSON.stringify(data)
        },
    },
}

let mongoDb = {
    type: 'mongo',
    config: {
        host: 'mongodb://localhost/shymean',
        document: 'joke',
        schema: {
            content: String
        },
    }
}

let db = new DB(mongoDb)
sp.start().then(data => {
    db.save(data)
})