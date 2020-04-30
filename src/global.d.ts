declare namespace PettySpider {
    interface SingleStrategy {
        selector: string,
        parse: Function
    }

    interface SpiderTask {
        url: string,
        request: Function
    }
}
