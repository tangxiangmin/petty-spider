/**
 * 2018/8/28 下午3:07
 */

let util = {
    /**
     *
     * @param {需要分组的数据} arr
     * @param {每组的长度} length
     */
    genGroup(arr, length) {
        let group = [];
        for (let i = 0; i < arr.length;) {
            let sub = arr.slice(i, i + length);
            i += length;

            group.push(sub);
        }
        return group;
    },
    /**
     *
     * @param {数组} group
     * @param {回调函数} cb
     * @param {*} delay
     */
    throttle(group, cb, delay = 200) {
        for (let i = 0; i < group.length; ++i) {
            setTimeout(() => {
                cb(group[i]);
            }, delay * i);
        }
    }
}

class UrlFactory {
    constructor() {
        // 维护一个url队列
        this.queue = []
    }

    addUrl(url) {
        this.queue.push(url)
    }

    getUrl() {
        return this.queue.shift()
    }

    // 流水线
    createAssemblyLine(cb, length) {
        let group = util.genGroup(this.queue, length)
        util.throttle(group, (url) => {
            cb(url)
        })
    }
}

// todo 从其他地方填充url
// 模拟一批url数据
let factory = new UrlFactory()
for (let i = 1; i < 2; ++i) {
    let url = `https://www.qiushibaike.com/8hr/page/${i}/`
    factory.addUrl(url)
}

// 导出数据单例
module.exports = factory
