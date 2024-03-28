import { resolve } from 'path'
import { outputFile, pathExists, readFile, createWriteStream, ensureFile } from 'fs-extra'

import { globalConfig } from './config'

function getFilePath(key: string): string {
  return resolve(globalConfig.cachePath, key)
}
async function writeCache(key: string, content: string, json: boolean) {
  const filePath = getFilePath(key)
  if (json) {
    content = JSON.stringify(content)
  }
  await outputFile(filePath, content)
}

async function getCache(key: string, json: boolean) {
  const filePath = getFilePath(key)
  if (await pathExists(filePath)) {
    const content = await readFile(filePath)
    if (content) {
      return json ? JSON.parse(content.toString()) : content.toString()
    }
    return null
  }
  return null
}

export async function downloadResource(key: string, request: () => Promise<any>, cache: boolean, json: boolean): Promise<any> {
  if (cache) {
    const res = await getCache(key, json)
    if (res) {
      return res
    }
  }
  const response = await request()
  await writeCache(key, response, json)
  return response
}

export async function downloadMedia(path: string, request: () => Promise<any>): Promise<boolean> {
  const response = await request()
  await ensureFile(path)
  const writer = await createWriteStream(path)

  return new Promise((resolve, reject) => {
    response.data.pipe(writer)
    writer.on('finish', () => {
      resolve(true)
    })

    writer.on('error', (err: Error) => {
      reject(err)
    })
  })
}
