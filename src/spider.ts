import * as cheerio from 'cheerio'

import {HTMLParseStrategy, JSONParseStrategy, ParseStrategy} from './strategy'

import log from './log'

type SpiderConfig = {
  request: () => Promise<string>,
  strategy: ParseStrategy[],
  filter?: (params: any) => boolean,
}

class Spider {
  config: SpiderConfig

  constructor(config: SpiderConfig) {
    if (!config.filter) {
      config.filter = (_) => {
        return true
      }
    }
    this.config = config
  }

  public async start() {
    const {request} = this.config
    try {
      const html = await request()
      const result = this.parseResponse(html)
      return this.handleResult(result)
    } catch (e) {
      log.error('抓取任务报错', e)
    }
  }

  private parseResponse(response) {
    let {strategy = []} = this.config
    let result = []

    strategy.forEach((strategy: ParseStrategy) => {
      try {
        if (strategy.json) {
          const {parse} = strategy as JSONParseStrategy
          parseJSON(parse)
        } else {
          const {selector, parse} = strategy as HTMLParseStrategy
          parseHTML(selector, parse)
        }
      } catch (e) {
        log.error('parse 解析失败', e)
      }
    })

    return result

    function formatParseResult(res) {
      // 如果在解析函数中对数据进行拆分，则拼接数组
      if (Array.isArray(res)) {
        result = result.concat(res)
      } else if (res) {
        result.push(res)
      }
    }

    // 解析JSON响应，处理直接抓取接口的形式
    function parseJSON(parse) {
      let res = parse(response)
      formatParseResult(res)
    }

    // 解析HTML响应
    function parseHTML(selector, parse) {
      let $ = cheerio.load(response);
      let $dom = $(selector)
      $dom.each(function () {
        let $this = $(this)
        let res = parse($this, $)


        formatParseResult(res)
      })
    }
  }

  private handleResult(data) {
    let {filter} = this.config
    let result = []
    Array.isArray(data) && data.forEach((item) => {
      if (filter(item)) {
        result.push(item)
      }
    })
    return result
  }
}

export default Spider
