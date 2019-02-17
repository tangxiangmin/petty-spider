import React, {Component} from 'react';

import './index.scss'

const {ipcRenderer} = window.require('electron');

class App extends Component {
    constructor() {
        super();
        this.state = {
            url: 'http://www.laifudao.com/wangwen/youmoxiaohua_${i}.htm',
            pageNum: 1,
            saveType: 'file',
            strategies: `
[{
    selector: '.article .contentHerf',
    parse($dom) {
        // 这里处理对应的数据格式
        return {
            content: $dom.text()
        }
    },
}, {
    selector: '.tiezi .text',
    parse($dom) {
        // 这里处理对应的数据格式
        return {
            content: $dom.text()
        }
    },
}]`
        };

        ipcRenderer.on("scrawl-reply", (event, args) => {
            console.log(args)
            alert('抓取完毕')
        })
    }

    inputChange(event, key) {
        console.log(key)
        this.setState({
            [key]: event.target.value
        });
    }

    submit() {
        let {url, pageNum, strategies} = this.state

        let params = {
            url, pageNum, strategies
        }

        ipcRenderer.send("start-scrawl", params)
    }

    render() {
        let {url, pageNum, strategies} = this.state
        return (
            <div className="form">
                <div className="form_group">
                    <div className="form_label">存储方式</div>
                    <select name="" id="" onChange={(e) => this.inputChange(e, 'saveType')}>
                        <option value="file">文件储存</option>
                        <option value="mongo">MongoDB</option>
                        <option value="excel">Excel</option>
                    </select>
                </div>
                <div className="form_group">
                    <div className="form_label">网址</div>
                    <input type="text" value={url} onChange={(e) => this.inputChange(e, 'url')} className="form_input"
                           placeholder="请输入待抓取的网址，页数使用${i}代替"/>
                </div>
                <div className="form_group">
                    <div className="form_label">抓取页数</div>
                    <input type="text" value={pageNum} onChange={(e) => this.inputChange(e, 'pageNum')}
                           className="form_input" placeholder="请输入需要抓取的页数"/>
                </div>
                <div className="form_group">
                    <div className="form_label">抓取策略</div>
                    <textarea className="form_textarea" value={strategies}
                              onChange={(e) => this.inputChange(e, 'strategies')}></textarea>
                </div>
                <button onClick={this.submit.bind(this)}>开始抓取</button>
            </div>
        );
    }
}

export default App;
