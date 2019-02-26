/**
 * 2019/2/26 下午5:46
 */

import './Tab.scss'
import React, {Component} from 'react'
import {Link} from "react-router-dom";

export default class Tab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0
        }
    }

    toggleNav(index) {
        this.setState({
            activeIndex: index
        })
    }

    render() {
        let navItems = this.props.tabNav
        let tabPanels = this.props.tabPanel

        let activeIndex = this.state.activeIndex
        return (
            <div className="tab">
                <div className="tab_nav">
                    {
                        navItems.map((item, index) => {
                            return (
                                <div onClick={this.toggleNav.bind(this, index)}
                                     className={['tab_item', index === activeIndex ? 'tab_item-on' : ''].join(" ")}

                                     key={index}>{item}</div>
                            )
                        })
                    }
                </div>
                <div className="tab_bd">
                    {
                        tabPanels.map((item, index) => {
                            console.log(index)
                            if (index === activeIndex) {
                                return (
                                    <div className="tab_box" key={index}>
                                        {item}
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        )
    }
}
