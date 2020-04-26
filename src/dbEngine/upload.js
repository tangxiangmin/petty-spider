// 直接将抓取的数据上传

class UploadDB {
    constructor({request}) {
        this.request = request
    }

    save(data) {
        return this.request(data)
    }
}

module.exports = UploadDB
