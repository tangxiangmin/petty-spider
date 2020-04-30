/**
 * 2018/8/27 下午9:49
 */

const mongoose = require('mongoose')
import log from '../log'

class Mogno {
    static instance = undefined;
    host: string
    schema: Object
    document: string
    model: any

    constructor(config) {
        if (Mogno.instance) {
            return Mogno.instance
        }

        Mogno.instance = this

        let {schema, host, document} = config
        this.schema = schema
        this.host = host
        this.document = document

        this.initConnect()
        this.model = this.getModel()
    }

    initConnect() {
        mongoose.connect(this.host, {useNewUrlParser: true})
        const connect = mongoose.connection
        connect.on('error', err => {
            if (err) {
                console.log(`connect error: ${err}`)
            }
        })
        connect.once('open', () => {
            // console.log(`The mongodb is opened!`)
        })
    }

    getModel() {
        const Schema = mongoose.Schema;

        const schema = new Schema(this.schema)
        return mongoose.model(this.document, schema)
    }

    save(data) {
        let Model = this.model
        let tasks = []
        data.forEach(item => {
            let row = new Model(item)
            let handler = row.save()
            tasks.push(handler)
        })

        return Promise.all(tasks).then(res => {
            log.info(`====success save in mongodb====`)
            // this.close()
        }).catch(e => {
            log.error(`mongodb保存数据错误`, e)
        })
    }

    close() {
        mongoose.disconnect()
    }
}

export default Mogno
