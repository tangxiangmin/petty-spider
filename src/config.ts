import { resolve, dirname } from 'path'

type GlobalConfig = {
  cachePath: string
  logPath: string
}

const base = dirname(process.mainModule!.filename as string)
export const globalConfig: GlobalConfig = {
  cachePath: resolve(base, './caches'),
  logPath: resolve(base, './logs'),
}

export function setGlobalConfig(config: Partial<GlobalConfig>): void {
  Object.assign(globalConfig, config)
}
