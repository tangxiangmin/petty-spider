import './App.scss'

import React, {Component} from 'react';

import {BrowserRouter as Router, Route, Link} from 'react-router-dom';


import TaskDetailPage from './pages/TaskDetail'
import TaskCreatePage from './pages/TaskCreate'
import TaskListPage from './pages/TaskList'

class App extends Component {
    render() {

        let recordList = [1, 2, 3]
        return (
            <Router>

                <div className={`page`}>
                    <aside className={`page_sd`}>
                        <ul>
                            <button>
                                <Link to={`/task/create`}>
                                    新增任务
                                </Link>
                            </button>
                            <li>
                                <Link to={`/task/list`}>
                                    任务列表
                                </Link>
                            </li>
                        </ul>
                    </aside>
                    <main className={`page_mn`}>
                        <div>
                            <Route path="/task/record/:id" component={TaskDetailPage}/>
                            <Route path="/task/create" component={TaskCreatePage}/>
                            <Route path="/task/list" component={TaskListPage}/>
                        </div>

                    </main>
                </div>
            </Router>
        )
    }
}

export default App;
