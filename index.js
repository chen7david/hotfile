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

    filename(name, ext){
        if(ext) this.ext = ext
        return [
            name || this.name, 
            this.ext && this.ext.replace('.','') || null
        ].filter(e => e != null).join('.')
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

    static async exists(file) {
        return fs.promises.access(file, fs.constants.F_OK)
            .then(() => true).catch(() => false)
    }

    async exists(file) {
        return fs.promises.access(file, fs.constants.F_OK)
            .then(() => true).catch(() => false)
    }

    async rename(name, ext){
        if(ext) this.ext = ext
        const toPath = p.join(this.parent, this.filename(name))
        return await this.move(toPath)
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

    async createChildDir(name){
        if(this.isFile) throw('append only works on directories')
        let path = p.join(this.path, name) 
        return fs.promises.mkdir(path, { recursive: true })
            .then(() => {
                const dir = new Hotfile(path)
                this.children.push(dir)
                return dir
            }).catch(() => false)
    }

    async moveTo(toPath, name){
        if(toPath instanceof Hotfile) {
            if(!toPath.isDirectory) throw('you can not move to a file, please provide a directory path')
            toPath = name ? p.join(toPath.parent, name) : toPath.path
        }
        if(!p.extname(toPath)) toPath = p.join(toPath, this.filename())
        if(await this.exists(toPath)) return false
        return fs.promises.rename(this.path, toPath).then(async () => {
                await Object.assign(this, new Hotfile(toPath))
                return true
        }).catch(() => false)
    }

    filesThrough(item, func){
        if(!(toPath instanceof Hotfile)) throw('filesThrough expects only instances Hotfiles.')
        const files = []
        function extract(item){
            if(item.isDirectory) {
                for(let child of item.children) extract(child)
            }else{
                func ? files.push(func(item)) : files.push(item)
            }
        }
        extract(item, func)
        return files
    }
}

module.exports = Hotfile