/**
 * 2018/8/26 上午10:22
 * 处理登录鉴权的逻辑
 */

module.exports = {
    decorate(config) {
        config.header['X-test-info'] = 'test'
        return config
    }
}