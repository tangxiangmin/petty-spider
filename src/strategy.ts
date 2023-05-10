import cheerio from 'cheerio'

export type JSONParseStrategy = {
  json: true,
  parse: (data: any) => any
}

export type HTMLParseStrategy = {
  json: boolean,
  selector: string,
  parse: (dom: cheerio.Cheerio, $: cheerio.Root) => any
}

export type ParseStrategy = JSONParseStrategy | HTMLParseStrategy

export interface UrlStrategyPage {
  rtype: string | RegExp,
  strategy: ParseStrategy[]
}

class UrlStrategy {
  pages: UrlStrategyPage[]

  constructor(pages: UrlStrategyPage[]) {
    this.pages = []
  }

  static match(expected, actual = '') {
    if (typeof expected === 'string') {
      return expected.toLowerCase() === actual.toLowerCase()
    }

    if (expected instanceof RegExp) {
      return expected.test(actual)
    }
  }

  addPage(page: UrlStrategyPage) {
    this.pages.push(page)
  }

  // 获取对应url的解析策略
  getPageStrategy(url) {
    let pages = this.pages
    for (let i = 0; i < pages.length; ++i) {
      let page = pages[i]
      let {rtype, strategy} = page

      if (UrlStrategy.match(rtype, url)) {
        return strategy
      }
    }
  }
}

export default UrlStrategy
