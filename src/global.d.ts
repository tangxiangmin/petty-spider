declare namespace PettySpider {
    interface SingleStrategy {
        selector?: string,
        json?: Boolean,
        parse: Function
    }

    interface SpiderTask {
        url: string,
        request: Function
    }
}
