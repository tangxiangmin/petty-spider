/**
 * 2018/8/25 下午10:34
 * 文件存储模式
 */

let fs = require('fs-extra')
let path = require('path')

class FileDB {
    constructor(config) {
        this.config = config
    }

    save(data) {
        let {dist} = this.config
        let disDir = path.dirname(dist)

        fs.ensureDir(disDir).then(() => {
            let encoding = 'utf-8'
            return fs.writeFile(dist, data, encoding);
        }).then(res => {
            console.log(`====write ${dist} success====`)
        }).catch(err => {
            if (err) throw err;
        })
    }
}

module.exports = FileDB