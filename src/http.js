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

let isMock = true
module.exports = {
    getPageContent(url) {
        if (isMock) {
            return fs.readFile('./mock/qiushi.html', 'utf-8')
        } else {
            return axios.get(url).then(res => res.data)
        }
    }
}