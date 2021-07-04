const p = require('path')
const fs = require('fs')
const Hot = require('./Hot')

/*
    setNameTo(string) => this
    setExtTo(string) => this
    setBasenameTo(string) => this
    async renameTo(string) => boolean
    async renameTo(string) => boolean
    async moveTo(Hotfile/Hotfolder) => boolean
    this.filename => string
*/

class Hotfile extends Hot {
    constructor(path){
        super(path)
        this.ext = p.extname(path)
    }

    get filename(){
        return this.basename.replace(this.ext, '')
    }

    setNameTo(name){
        if(!name) throw(new Error(`setNameTo() expects a String, ${name} provided`))
        this.basename = name + this.ext
        return this
    }

    setExtTo(ext = null){
        if(ext == null) throw(new Error(`setExtTo() expects a String, ${ext} provided`))
        const _ext = '.' + ext.replace(/\.*/g,'')
        this.basename = this.basename.replace(this.ext, _ext)
        this.ext = _ext
        return this
    }

    setBasenameTo(name = null){
        if(!name) throw(new Error(`setBasenameTo() expects a String, ${name} provided`))
        this.basename = name
        this.ext = p.extname(name)
        return this
    }

    async renameTo(name = null){
        if(name) this.setBasenameTo(name)
        await this.moveTo()
        return true
    }

    async moveTo(instance = null, options = {}){
        const { force } = options
        const Hotfolder = require('./Hotfolder')
        if(instance && (!(instance instanceof Hotfolder) && !(instance instanceof Hotfile))) 
            throw(new Error(`moveTo() expects Hotfolder instace or null, ${instance} provided`))
        let destDir = this.parent
        if(instance) destDir = instance.isFile ? instance.parent : instance.path
        const to = p.join(destDir, this.basename)
        if(force || !await this.exists(to)) await this.rename(this.path, to)
        return true
    }
}

module.exports = Hotfile