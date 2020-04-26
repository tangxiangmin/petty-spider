// 抓取整站 todo 使用APP 重构
let axios = require("axios")
let cheerio = require("cheerio")

let fs = require("fs-extra")
let http = require('src/http')
let path = require('path')

let config = {
    index: "",
    hostname: ""
};

// 保存已获取的资源
let cache = [];

class Fullpage {
    constructor() {
    }

    saveFile(file, content, encoding = 'utf-8', cb = null) {
        let root = './tmp/'
        let filename = file

        // 去除域名，保留站点根目录
        if (/https?:\/\//.test(file)) {
            let HOSTLENGTH = config.hostname.length;
            filename = file.substr(HOSTLENGTH);

            if (filename === "") {
                filename = "index.html";
            }
        }
        filename = root + filename

        let fileObj = path.parse(filename)
        let {dir} = fileObj

        fs.ensureDir(dir).then((res) => {
            fs.writeFile(filename, content, encoding, function (err) {
                if (err) throw err
                if (typeof cb === 'function') {
                    cb(err)
                }

                console.log(`====write ${filename} success====`)
                cache[filename] = true;
            });
        }).catch(err => {
            if (err) throw err;
        })
    }

    // 启动
    start() {
        let startIndex = config.index
        axios.get(startIndex).then(res => {
            let data = res.data;
            this.saveFile(startIndex, data, 'utf-8',)

            let resource = this.getPageResource(data);
            resource.forEach(val => {
                let {src, encoding} = val;
                if (!cache[src]) {
                    this.getSource(src, encoding);
                }
            });
        });
    }

    getSource(src, encoding = "utf-8") {
        // 补全相对路径
        if (!/https?:\/\//.test(src)) {
            src = config.hostname + src;
        }

        // 获取相关资源
        http.get(encodeURI(src), (res) => {
            let pageData = "";
            res.setEncoding(encoding);

            res.on("error", function (errget) {
                console.log("Eh, It's wrong");
            });
            res.on("data", function (chunk) {
                pageData += chunk;
            });

            res.on("end", () => {
                this.saveFile(src, pageData, encoding)
            });
        });
    }

    getPageResource(pageData) {
        let resource = [];
        let $ = cheerio.load(pageData);

        // 获取页面资源
        $("link, script, img").each(function () {
            let src = "";
            let encoding = "utf-8";
            let tagName = $(this).prop("tagName");

            switch (tagName) {
                case "LINK":
                    src = $(this).attr("href");
                    break;
                case "SCRIPT":
                    src = $(this).attr("src");
                    break;
                case "IMG":
                    src = $(this).attr("src");
                    encoding = "binary";
                    break;
                default:
                    console.log("bug~");
            }

            if (src) {
                if (/^\.\//.test(src)) {
                    src = src.replace(/\.\//, "");
                }
                if (resource.indexOf(src) == -1) {
                    resource.push({
                        src: src,
                        encoding: encoding,
                        type: tagName
                    });
                }
            }
        });

        return resource
    }
}


let spider = new Fullpage()

spider.start()
