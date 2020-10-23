const p = require('path')
const fs = require('fs')

class Hotfile {

    constructor(path){
        const stats = fs.statSync(path)
        this.isDirectory = stats.isDirectory()
        this.isFile = stats.isFile()
        this.parent = p.resolve(path).replace('/' + p.basename(path), '')
        this.path = p.resolve(path)
        this.name = p.basename(path).replace(p.extname(path), '')
        this.basename = p.basename(path)
        this.size = stats.size
        this.isDirectory ? this.children = [] : this.ext = p.extname(path)
    }

    static async map(path, options = {}){
        const items = await this.readdir(path, options)
        for(let i = 0; i < items.length; i++){
            if(items[i].isDirectory) items[i].children = await this.map(items[i].path, options)
        }
        return items
    }

    static async readdir(path, options = {}){
        const { model, exclude } = options
        let items = await fs.promises.readdir(path)
        if(exclude) items = items.filter(item => !(exclude).test(item))
        return items.map(i => model ? new model(p.resolve(path,i)) : new Hotfile(p.resolve(path,i)))
    }
}

module.exports = Hotfile