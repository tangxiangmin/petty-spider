/**
 * 2018/8/23 下午11:05
 */

let axios = require('axios')
// let fs = require('fs-extra')


module.exports = {
    addRequestInterceptor(resolve) {
        axios.interceptors.request.use(
            resolve,
            err => {
                return Promise.reject(err)
            }
        );
    },
    getPageContent(url) {
        return axios.get(url).then(res => {
            let html = res.data
            return html
        }).catch(e => {
            console.log(`请求${url}失败`)
        })
    }
}
