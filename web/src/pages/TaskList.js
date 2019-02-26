/**
 * 2019/2/26 下午5:43
 */


import React, {Component} from 'react'
import {Link} from "react-router-dom";

import Tab from '../components/Tab'

const RecordItem = (props) => {
    let {isFinish, id} = props
    return (
        <div>
            <Link to={`/task/record/${id}`}> {isFinish ? `已完成任务记录${id}` : `正在进行${id}`}</Link>
        </div>
    )
}

export default class TaskList extends Component {
    render() {
        let recordList = [1, 2, 3]
        let tabNav = ['已完成', '未完成']

        let tabPanel = [(
            <div>
                {
                    recordList.map((item, index) => {
                        return (
                            <RecordItem key={index} isFinish={true} id={item}/>
                        )
                    })
                }
            </div>
        ), (
            <div>
                {
                    recordList.map((item, index) => {
                        return (
                            <RecordItem key={index} isFinish={false} id={item}/>
                        )
                    })

                }
            </div>
        )]

        return (
            <div>
                <Tab tabNav={tabNav} tabPanel={tabPanel}/>
            </div>
        )
    }
}
