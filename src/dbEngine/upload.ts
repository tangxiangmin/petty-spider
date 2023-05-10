// 直接将抓取的数据上传

export type UploadDBConfig = {
  request: (data: any) => void
}

class UploadDB {
  request: Function

  constructor({request}: UploadDBConfig) {
    this.request = request
  }

  save(data) {
    return this.request(data)
  }
}

export default UploadDB

