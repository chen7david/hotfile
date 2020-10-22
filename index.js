const p = require('path')
const fs = require('fs')

class Hotfile {
    constructor(path){
        const stats = fs.statSync(path)
        this.isDirectory = stats.isDirectory()
        this.isFile = stats.isFile()
        this.parent = p.resolve(path).replace('/' + p.basename(path), '')
        this.path = p.resolve(path)
        this.size = stats.size
        this.name = p.basename(path).replace(p.extname(path), '')
        this.basename = p.basename(path)
        this.isDirectory ? this.children = [] : this.ext = p.extname(path)
    }

    filename(name, ext){
        if(ext) this.ext = ext
        return [
            name || this.name, 
            this.ext && this.ext.replace('.','') || null
        ].filter(e => e != null).join('.')
    }

    static async mkdir(path){
        return fs.promises.mkdir(path, { recursive: true })
            .then(() => new Hotfile(path)).catch(() => false)
    }

    static async readdir(path){
        const items = await fs.promises.readdir(path)
        return items.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item))
           .map(i => new Hotfile(p.resolve(path,i)))
    }

    static async map(path){
       const items = await this.readdir(path)
       for(let i = 0; i < items.length; i++){
           if(items[i].isDirectory) items[i].children = await this.map(items[i].path)
       }
       return items
    }

    async rename(name, ext){
        if(ext) this.ext = ext
        const toPath = this.parent + '/' + this.filename(name)
        return await this.move(toPath)
    }

    async moveTo(toPath){
        if(toPath instanceof Hotfile && toPath.isDirectory) toPath = toPath.path
        toPath = toPath + '/' + this.filename()
        return fs.promises.rename(this.path, toPath).then(async () => {
                await Object.assign(this, new Hotfile(toPath))
                return true
        }).catch(() => false)
    }

    async move(toPath){
        return fs.promises.rename(this.path, toPath).then(async () => {
                await Object.assign(this, new Hotfile(toPath))
                return true
        }).catch((err) => {
            console.log(err)
            return false
        })
    }

    async appendDirectory(name){
        if(this.isFile) throw('append only works on directories')
        let path = this.path + '/' + name
        return fs.promises.mkdir(path, { recursive: true })
            .then(() => {
                const dir = new Hotfile(path)
                this.children.push(dir)
                return dir
            }).catch(() => false)
    }

    async delete(){
        return fs.promises.unlink(this.path).then(async () => {
            await Object.assign(this,{parent: null, path: null, name: null, metadata: null})
            return true
        }).catch(() => false)
    }
}

module.exports = Hotfile