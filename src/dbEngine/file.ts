/**
 * 2018/8/25 下午10:34
 * 文件存储模式
 */

let fs = require('fs-extra')
let path = require('path')
import log from '../log'

class FileDB {
    config: { dist: string }

    constructor(config) {
        this.config = config
    }

    save(data) {
        let {dist} = this.config
        let disDir = path.dirname(dist)
        log.info('File准备写入数据')

        return fs.ensureDir(disDir).then(() => {
            let encoding = 'utf-8'

            return new Promise((resolve, reject) => {
                fs.writeFile(dist, data, encoding, function (err) {
                    if (err) {
                        log.error('File写入数据错误', err)
                    } else {
                        log.info(`====File.save ${dist} success====`)
                        resolve(true)
                    }
                });
            })
        })
    }
}

export default FileDB
