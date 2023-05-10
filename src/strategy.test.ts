import {describe, it, expect} from 'vitest'
import UrlStrategy from "./strategy";

// @ts-ignore
describe('test', () => {
  //@ts-ignore
  it('getPageStrategy show return match  strategy', () => {
    const url = 'test'
    const page = {
      rtype: url,
      strategy: [{
        json: false,
        selector: '#id',
        parse(dom, $) {
          return {}
        }
      }]
    }
    const instance = new UrlStrategy([page])
    const result = instance.getPageStrategy(url)
    expect(result === page.strategy)
  })

})
