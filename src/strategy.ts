import cheerio from 'cheerio'

type HandlerMap = {
  [key: string]: {
    selector: string
    list: boolean // 是否存在多个相同选择器，需要返回列表元素
    parse: (dom: cheerio.Cheerio, $: cheerio.Root) => any
  }
}

type HandlerResult<T extends HandlerMap> = {
  [K in keyof T]: T[K]['list'] extends true ? ReturnType<T[K]['parse']>[] : ReturnType<T[K]['parse']>
}

export function parseHTMLResponse<T extends HandlerMap>(html: string, strategyMap: T): HandlerResult<T> {
  const $ = cheerio.load(html)
  const result: Partial<HandlerResult<T>> = {}

  const keys = Object.keys(strategyMap)
  for (const key of keys) {
    const strategy = strategyMap[key]
    const { selector, list, parse } = strategy
    const $dom = $(selector)
    const arr: ReturnType<typeof parse>[] = []
    $dom.each(function () {
      // @ts-ignore
      const $this = $(this)
      const res = parse($this, $)
      arr.push(res)
    })
    result[key as keyof T] = list ? arr : arr[0]
  }
  return result as HandlerResult<T>
}
