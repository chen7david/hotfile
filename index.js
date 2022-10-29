const fs = require('fs')
const { resolve, parse } = require('path')

class Hotfile {
  constructor(path, options = {}) {
    if (options.mkdir && !Hotfile.existsSync(path)) {
      Hotfile.mkdirSync(path)
    }
    const stat = fs.lstatSync(path)
    const { ext, name, base } = parse(path)
    this.isDirectory = stat.isDirectory()
    this.path = resolve(path)
    this.name = name
    this.base = base
    this.size = stat.size
    this.isDirectory ? (this.children = []) : (this.ext = ext)
    if (options.stat) this.stat = stat
  }

  static mkdirSync(path, options = { recursive: true }) {
    let flag = true
    try {
      fs.mkdirSync(path, options)
      flag = new Hotfile(path)
    } catch (e) {
      flag = false
    }
    return flag
  }

  static existsSync(path) {
    let flag = true
    try {
      fs.accessSync(path, fs.constants.F_OK)
    } catch (e) {
      flag = false
    }
    return flag
  }

  static async exists(path) {
    try {
      await fs.promises.access(path, fs.constants.F_OK)
      return true
    } catch (err) {
      if (err.message.includes('no such file or directory')) return false
    }
  }

  static async mkdir(path, options = {}) {
    const { recursive, force } = options
    if (!force && (await this.exists(path))) return false
    try {
      await fs.promises.mkdir(path, { recursive })
      return new Hotfile(path)
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async loadChildren(options = {}, currentDepth) {
    this.children = []
    typeof currentDepth === 'number' ? currentDepth++ : (currentDepth = 1)
    const items = await fs.promises.readdir(this.path)
    for (let i = 0; i < items.length; i++) {
      const path = resolve(this.path, items[i])
      const hotfile = new Hotfile(path, options.options ? options.options : {})
      if (
        typeof options.filter === 'function' &&
        !((await options.filter(hotfile)) || hotfile.isDirectory)
      )
        continue
      if (typeof options.cb === 'function') await options.cb(hotfile)
      this.children.push(hotfile)

      if (hotfile.isDirectory) {
        if (
          typeof options.depth === 'number' &&
          !(options.depth >= currentDepth)
        )
          continue
        try {
          await hotfile.loadChildren(options, currentDepth)
        } catch (error) {
          console.log(error)
        }
      }
    }
    return this
  }

  loadChildrenSync(options = {}, currentDepth) {
    this.children = []
    typeof currentDepth === 'number' ? currentDepth++ : (currentDepth = 1)
    const items = fs.readdirSync(this.path)
    for (let i = 0; i < items.length; i++) {
      const path = resolve(this.path, items[i])
      const hotfile = new Hotfile(path, options.options ? options.options : {})
      if (
        typeof options.filter === 'function' &&
        !(options.filter(hotfile) || hotfile.isDirectory)
      )
        continue
      if (typeof options.cb === 'function') options.cb(hotfile)
      this.children.push(hotfile)

      if (hotfile.isDirectory) {
        if (
          typeof options.depth === 'number' &&
          !(options.depth >= currentDepth)
        )
          continue
        try {
          hotfile.loadChildrenSync(options, currentDepth)
        } catch (error) {
          console.log(error)
        }
      }
    }
    return this
  }

  async createChildDirectory(directoryName) {
    const newPath = resolve(this.path, directoryName)
    await Hotfile.mkdir(newPath)
    const hotfolder = new Hotfile(newPath)
    this.children.push(hotfolder)
    return hotfolder
  }

  createChildDirectorySync(directoryName) {
    const newPath = resolve(this.path, directoryName)
    Hotfile.mkdirSync(newPath)
    const hotfolder = new Hotfile(newPath)
    this.children.push(hotfolder)
    return hotfolder
  }

  async delete() {
    await fs.promises.unlink(this.path)
    return null
  }

  updatePath(newPath) {
    this.path = newPath
    const { name, base } = parse(newPath)
    Object.assign(this, { name, base })
    return this
  }

  updateMetadata(newPath) {
    this.path = newPath
    const { name, base, ext } = parse(newPath)
    Object.assign(this, { name, base, ext })
    return this
  }

  async rename(newbase) {
    const oldPath = this.path
    const newPath = this.path.replace(this.base, newbase)
    this.updateMetadata(newPath)
    await fs.promises.rename(oldPath, newPath)
    return this
  }

  async moveTo(destinationPath, options = {}) {
    const { replace } = options
    const hotfolder =
      destinationPath instanceof Hotfile
        ? destinationPath
        : new Hotfile(destinationPath)
    if (!hotfolder.isDirectory)
      throw new Error('destination must be a folder, file provided')
    const oldPath = this.path
    const newPath = resolve(hotfolder.path, this.base)
    this.updatePath(newPath)
    if ((await Hotfile.exists(newPath)) && !replace) return null
    await fs.promises.rename(oldPath, newPath)
    return this
  }
}

module.exports = Hotfile
