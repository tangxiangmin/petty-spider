module.exports = [
    {
        rtype: /www.laifudao.com\/wangwen\/youmoxiaohua/,
        strategy: [{
            selector: '.post-article .article-content',
            parse($dom) {
                return {
                    content: $dom.text()
                }
            }
        }]
    }
]
