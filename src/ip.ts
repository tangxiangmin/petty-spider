/**
 * 爬虫ip代理，该功能暂时不开放
 */

let iconv = require('iconv-lite');
let axios = require('axios')
let log = require('./log')

function getProxyList() {
    let apiURL = 'http://www.66ip.cn/mo.php?sxb=&tqsl=100&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea=http%3A%2F%2Fwww.66ip.cn%2F%3Fsxb%3D%26tqsl%3D100%26ports%255B%255D2%3D%26ktip%3D%26sxa%3D%26radio%3Dradio%26submit%3D%25CC%25E1%2B%2B%25C8%25A1';


    let http = axios.create({
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
            'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
            'referer': 'http://www.66ip.cn/'
        }
    })
    return http.get(apiURL).then(res => {
        let body = res.data
        let ret = body.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,4}/g);
        return ret
    })
}


function testProxy(proxyUrl: string) {
    const [host, port] = proxyUrl.split(':')
    return axios.get('http://pv.sohu.com/cityjson', {
        proxy: {
            host,
            port: parseInt(port)
        },
        timeout: 3000
    }).then(res => {
        let data = iconv.decode(res.data, "gb2312");
        let config = {host, port, data}
        console.log(`testing ${proxyUrl} success`)
        return config
    }).catch(e => {
        log.error(`testing ${proxyUrl} error`)
    })
}

testProxy("27.220.50.228:9000")


function start() {
    getProxyList().then(async function (proxyList) {
        log.info('getProxyList 获取代理列表：', proxyList)
        console.log('代理列表获取完毕，准备校验')
        let validProxy = []
        for (let url of proxyList) {
            console.log(`start proxyUrl ${url}`)
            await testProxy(url).then((config) => {
                config && validProxy.push(config)
            })
        }
        log.info('======result====')
        log.info('valid proxyList: ', validProxy)
        console.log('done')
    }).catch(e => {
        log.error('getProxyList 获取ip列表失败: ', e)
    })

}


// 代理池
class ProxyPool {
    getProxyList() {

    }

    validIP() {

    }
}

export default ProxyPool
