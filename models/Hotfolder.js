const p = require('path')
const fs = require('fs')
const Hot = require('./Hot')

/*
    create(string, data, boolean) => boolean
    loadChildren(options) => this
    this.foldername => string
*/

class Hotfolder extends Hot {
    constructor(path){
        super(path)
        this.children = []
    }

    get foldername(){
        return this.basename
    }

    async create(name, data = '', force = false){
        const Hotfile = require('./Hotfile')
        const path = p.join(this.path, name)
        if(!force || await this.exists(path)) return false
        await fs.promises.appendFile(path, data)
        this.children.push(new Hotfile(path))
        return true
    }

    async createFolder(name, options = { recursive: true }){
        const path = p.join(this.path, name)
        console.log({path})
        await this.mkdir(path, options)
        const folder = new Hotfolder(path)
        this.children.push(folder)
        return folder
    }

    async loadChildren(options = {}){
        if(!this.isFile) this.children = await this.scandir(this.path,options)
        return this
    }

    async scandir(path, options = {}){
        let { limit } = options
        const items = await this.readdir(path, options)
        limit = limit && limit < items.length ? limit : items.length
        for(let i = 0; i < limit; i++)
            if(!items[i].isFile) items[i].children = await this.scandir(items[i].path, options)
        return items
    }
                        
    async readdir(path, options = {}){
        const { exclude, include, allow, deny } = options
        let items = await fs.promises.readdir(path)
        if(exclude) items = items.filter(o => !exclude.includes(o))
        if(include) items = items.filter(o => include.includes(o))
        if(allow) items = items.filter(o => allow.find(regex => (regex).test(o)))
        if(deny) items = items.filter(o => !deny.find(regex => (regex).test(o)))
        const results = []
        for(let o of items) results.push(await Hot.spawn(p.resolve(path,o), options))
        return results
    }
}

module.exports = Hotfolder