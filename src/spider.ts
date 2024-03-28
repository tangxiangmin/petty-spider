import log from './log'
import { downloadResource } from './download'

type SpiderConfig<R, P> = {
  key: string
  cache: boolean
  json: boolean
  request: () => Promise<R>
  parse: (data: R) => Promise<P>
  save: (data: P) => Promise<void>
}

export class Spider<R, P> {
  config: SpiderConfig<R, P>

  constructor(config: SpiderConfig<R, P>) {
    this.config = config
  }

  public async work(): Promise<P | null> {
    try {
      const { request, cache, key, parse, json, save } = this.config
      log.info(`抓取任务 key:${this.config.key}`)
      const response = await downloadResource(key, request, cache, json)
      const data = await parse(response)
      await save(data)
      return data
    } catch (e) {
      log.error(`抓取任务报错 key:${this.config.key}`, e)
      return null
    }
  }
}
