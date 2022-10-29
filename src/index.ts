import fs from 'fs'
import { resolve, parse } from 'path'

type HotfileAddOnProperty = 'id' | 'stat'

export interface HotfileOptions {
    /** depth restricts how many levels deep the scan should go */
    depth?: number
    /** generates md5 hashes of an item's path and adds that to the item as its id property */ 
    extendedProperties?: HotfileAddOnProperty[]
    /** if enabled, returns an flat (one-dimensional) list with all scanned files */
    flatten?: boolean
}

export class Hotfile {
    isDirectory?: boolean
    name?: string
    path?: string
    relativePath?: string
    base?: string
    size?: number
    children?: Hotfile[]
    ext?: string
    stat?: fs.Stats

    constructor(path: string, options?: HotfileOptions){
        if (!Hotfile.existsSync(path)) throw(new Error('Invalid path: ' + path))
        const { ext, name, base } = parse(path)
        const x= parse(path)
        const stat = fs.lstatSync(path)
        this.isDirectory = stat.isDirectory()
        this.name = name
        this.path = resolve(path)
        this.base = base
        this.size = stat.size
        this.isDirectory ? this.children = [] : this.ext = ext
        if (options?.extendedProperties?.includes('stat')) this.stat = stat
    }

    static existsSync(path: string) {
        let flag = true
        try {
            fs.accessSync(path, fs.constants.F_OK)
        } catch (e) {
            flag = false
        }
        return flag
    }
}