/**
 * 2018/8/23 下午11:05
 */

let axios = require('axios')
let fs = require('fs-extra')

axios.interceptors.request.use(
    config => {
        // return auth.decorate(config)
        // todo 注入登录账号的信息
        return config
    },
    err => {
        return Promise.reject(err)
    }
);

module.exports = {
    getPageContent(url) {
        return axios.get(url).then(res => {
            let html = res.data
            // console.log(html)
            // fs.writeFile('./mock/1.html', html, 'utf-8')
            return html
        }).catch(e=>{
            console.log(`请求${url}失败`)
        })
    }
}
