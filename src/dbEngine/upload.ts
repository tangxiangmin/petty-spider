// 直接将抓取的数据上传

class UploadDB {
    request: Function

    constructor({request}) {
        this.request = request
    }

    save(data) {
        return this.request(data)
    }
}

export default UploadDB

