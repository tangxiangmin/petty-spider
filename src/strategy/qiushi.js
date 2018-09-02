/**
 * 2018/8/30 上午8:47
 * 糗事百科内容页
 */

module.exports = [
    {
        rtype: /www.qiushibaike.com\/8hr\/page/,
        strategy: [{
            selector: '.article .contentHerf',
            parse($dom) {
                // 这里处理对应的数据格式
                return {
                    content: $dom.text()
                }
            },
        }, {
            selector: '.tiezi .text',
            parse($dom) {
                // 这里处理对应的数据格式
                return {
                    content: $dom.text()
                }
            },
        }]
    },
    {
        rtype: /www.qiushibaike.com\/(text|hot)\/page/,
        strategy: [{
            selector: '#content-left .content',
            parse($dom) {
                return {
                    content: $dom.text()
                }
            }
        }]
    }
]
