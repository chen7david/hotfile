import fs from 'fs'
import { resolve, parse } from 'path'
import { createHash } from 'crypto'

type HotfileAddOnProperty = 'id' | 'stat'

export interface HotfileOptions {
  /** depth restricts how many levels deep the scan should go */
  depth?: number
  /** generates md5 hashes of an item's path and adds that to the item as its id property */
  extendedProperties?: HotfileAddOnProperty[]
  /** if enabled, returns an flat (one-dimensional) list with all scanned files */
  flatten?: boolean

  cb?: (item: Hotfile) => Promise<Hotfile>
}

const md5 = (seed: string) => createHash('md5').update(seed).digest('hex')
export class Hotfile {
  isDirectory: boolean
  id?: string
  name: string
  path: string
  relativePath?: string
  base: string
  size: number
  children?: Hotfile[]
  ext?: string
  stat?: fs.Stats

  constructor(path: string, options?: HotfileOptions) {
    if (!Hotfile.existsSync(path)) throw new Error('Invalid path: ' + path)
    const { ext, name, base } = parse(path)
    const stat = fs.lstatSync(path)
    this.isDirectory = stat.isDirectory()
    this.name = name
    this.path = resolve(path)
    this.base = base
    this.size = stat.size
    this.isDirectory ? (this.children = []) : (this.ext = ext)
    if (options?.extendedProperties?.includes('stat')) this.stat = stat
    if (options?.extendedProperties?.includes('id')) this.id = md5(this.path)
  }

  static existsSync(path: string): boolean {
    let flag = true
    try {
      fs.accessSync(path, fs.constants.F_OK)
    } catch (e) {
      flag = false
    }
    return flag
  }

  async delete(): Promise<boolean> {
    await fs.promises.unlink(this.path)
    return true
  }

  async loadChildren(
    options?: HotfileOptions,
    depthTracker: number = 1
  ): Promise<Hotfile> {
    const fileNames = await fs.promises.readdir(this.path)
    depthTracker++
    for (let i = 0; i < fileNames.length; i++) {
      const path = resolve(this.path, fileNames[i])
      const hotfile = new Hotfile(path, options)
      this.children?.push(hotfile)
      if (hotfile.isDirectory && depthTracker <= (options?.depth || 1))
        await hotfile.loadChildren(options, depthTracker)
    }
    return this
  }
}
