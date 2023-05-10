import log from './log'
import DB, {DBConfig} from './db'
import Strategy, {UrlStrategyPage} from './strategy'
import Spider from './spider'

type Task = {
  url: string,
  request: Function
}

const defaultHooks = {
  afterEach: (task: Task, next: Task) => {
  }
}

type AppConfig = {
  saveConfig: DBConfig
}

type AppConfigWithEnv = {
  test?: AppConfig,
  prod?: AppConfig,
}

type AppEnv = keyof AppConfigWithEnv

export default class App {
  urlStrategy: Strategy;
  config: AppConfigWithEnv;
  tasks: Array<Task>

  constructor(config: AppConfigWithEnv) {
    this.urlStrategy = new Strategy([])
    this.tasks = []
    this.config = config
  }

  // 添加一个抓取任务
  addTask(task: Task) {
    this.tasks.push(task)
  }

  async start(mode: AppEnv, hooks = defaultHooks) {
    let modeConfig = this.config && this.config[mode]
    if (!modeConfig) throw `app.start: 未指定${mode}类型配置，请先调用addConfig添加`

    // todo 同时抓取多个任务
    const {tasks} = this
    while (tasks.length) {
      let task = tasks.shift()
      await this.runTask(task, modeConfig)

      let next = tasks[0] // 下一个待抓取的任务
      await hooks.afterEach(task, next)
    }
  }

  async runTask(task: Task, config: AppConfig) {
    let {url} = task
    let strategy = this.urlStrategy.getPageStrategy(url)
    const {saveConfig} = config
    let sp = new Spider({
      strategy,
      request: () => {
        return task.request()
      },
    })

    try {
      log.info(`开始抓取:${url}`)
      const data = await sp.start()
      if (!data) {
        log.error("未抓取到任何数据")
        return
      }
      log.info(`url:${url}抓取完毕, 获取数据:${data.length}`)
      let db = new DB(saveConfig)
      await db.save(data)
    } catch (e) {
      log.error('页面抓取失败', e)
    }

  }
}
