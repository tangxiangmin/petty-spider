/**
 * 2018/8/26 上午10:22
 * 处理登录鉴权的逻辑
 */


class Auth {
    constructor(config) {
        this.config = config
    }

    getLoginConfig(axiosRequestConfig) {
        let config = this.config
        axiosRequestConfig.header['X-test-info'] = 'test'

        return axiosRequestConfig
    }

    login() {
        let loginConfig = this.getLoginConfig()

        return Promise.resolve(true)
    }
}

module.exports = Auth
