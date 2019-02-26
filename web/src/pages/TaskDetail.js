/**
 * 2019/2/26 下午5:09
 */

import React, {Component} from 'react'

export default class TaskDetail extends Component {
    render() {
        const {match} = this.props

        return (
            <div>
                <div>id：{match.params.id}</div>
                <div>任务名称: 抓取笑话岛</div>
                <div>创建时间：2019-02-01 12:00:00</div>
                <div>抓取链接: http://www.laifudao.com/wangwen/youmoxiaohua_1.htm</div>
                <div>数据记录：共100条数据</div>
                <button>查看数据</button>
            </div>
        )
    }
}
