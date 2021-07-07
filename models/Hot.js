const p = require('path')
const fs = require('fs')

class Hot {

    constructor(path){
        if(p.extname(path) == "" && !this.existsSync(path)) this.mkdirSync(path)
        const stat = fs.statSync(path)
        this.isFile = stat.isFile()
        this.path = p.resolve(path)
        this.basename = p.basename(path)
        this.size = stat.size
    }

    get parent(){
        return p.dirname(this.path)
    }

    static async spawn(path, options = {}){
        const { cb } = options
        const stat = fs.statSync(path)
        const Hotfolder = require('./Hotfolder')
        const Hotfile = require('./Hotfile')
        const o = stat.isFile() ? new Hotfile(path, options) : new Hotfolder(path, options)
        if(cb) await cb(o)
        return o
    }

    async mkdir(path, options = {}){
        const { recursive, force } = options
        if(!force && await this.exists(path)) return false
        try {
            await fs.promises.mkdir(path, { recursive })
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    mkdirSync(path, options = { recursive: true }){
        let flag = true
        try{
            fs.mkdirSync(path, options)
        }catch(e){
          flag = false
        }
        return flag
    }

    static exists(path){
        let flag = true
        try{
          fs.accessSync(path, fs.constants.F_OK)
        }catch(e){
          flag = false
        }
        return flag
    }

    static mkdir(path, options = { recursive: true }){
        let flag = true
        try{
            fs.mkdirSync(path, options)
        }catch(e){
          flag = false
        }
        return flag
    }

    async exists(path){
        try {
            await fs.promises.access(path, fs.constants.F_OK)
            return true
        } catch (err) {
            if(err.message.includes('no such file or directory')) return false
        }
    }

    existsSync(path){
        let flag = true
        try{
          fs.accessSync(path, fs.constants.F_OK)
        }catch(e){
          flag = false
        }
        return flag
    }

    async rename(from, to){
        try {
            await fs.promises.rename(from, to)
            this.path = to
        } catch (err) {
            throw(err)
        }
    }

    async delete(){
        try {
            await fs.promises.unlink(this.path)
        } catch (err) {
            console.error('there was an error:', err.message)
        }
    }
}

module.exports = Hot