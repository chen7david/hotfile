const fs = require('fs')
const p = require('path')
const crypto = require('crypto')

class HotfileError extends Error {}

class Hotfile {

    constructor(path){
        if(p.extname(path) == "" && !this.existsSync(path)) this.mkdirSync(path)
        const stat = fs.statSync(path)
        this.isFile = stat.isFile()
        this.path = path
        this.basename = p.basename(path)
        this.size = stat.size
        stat.isDirectory() ? this.children = [] : this.ext = p.extname(path)
    }

    /* COMPUTED PROPERTIES */

    get name(){
        return this.ext ? this.basename.replace(this.ext, '') : this.basename
    }

    get foldername(){
        return this.basename
    }

    get lowername(){
        return this.name.toLowerCase()
    }

    get lowerbasename(){
        return this.basename.toLowerCase()
    }

    get parentPath(){
        return p.dirname(this.path)
    }
    
    id(){
        return this.md5Id(this.path)
    }

    /* GENERAL FUNCTIONS */

    md5Id(string){
        return crypto.createHash('md5').update(string).digest('hex');
    }

    static mkdirSync(path, options = { recursive: true }){
        let flag = true
        try{
            fs.mkdirSync(path, options)
        }catch(e){
          flag = false
        }
        return flag
    }

    static existsSync(path){
        let flag = true
        try{
          fs.accessSync(path, fs.constants.F_OK)
        }catch(e){
          flag = false
        }
        return flag
    }

    mkdirSync(path, options = { recursive: true }){
        if(!p.extname(path) == "") 
            throw(new Error(`mkdirSync expects a folder path, but ${path} provided`))
        let flag = true
        try{
            fs.mkdirSync(path, options)
        }catch(e){
          flag = false
        }
        return flag
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

    async exists(path){
        try {
            await fs.promises.access(path, fs.constants.F_OK)
            return true
        } catch (err) {
            if(err.message.includes('no such file or directory')) return false
        }
    }

    async mkdir(path, options = {}){
        if(!p.extname(path) == "") 
            throw(new Error(`mkdir expects a folder path, but ${path} provided`))
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

    /* FILE FUNCTIONS */

    setNameTo(name){
        if(!name) throw(new Error(`setNameTo expects a string, ${name} provided`))
        this.basename = name + this.ext
        return this
    }

    appendToBasename(text = null){
        if(text == null) throw(new Error(`setLangTo expects a string, ${text} provided`))
        const basename = this.name.concat(text)
        this.basename = this.basename.replace(this.name, basename)
        return this
    }

    setExtTo(ext = null){
        if(ext == null) throw(new Error(`setExtTo expects a string, ${ext} provided`))
        const _ext = '.' + ext.replace(/\.*/g,'')
        this.basename = this.basename.replace(this.ext, _ext)
        this.ext = _ext
        return this
    }

    setBasenameTo(name = null){
        if(!name) throw(new Error(`setBasenameTo expects a string, ${name} provided`))
        this.basename = name
        this.ext = p.extname(name)
        return this
    }

    async moveTo(instance = null, options = {}){
        const { force } = options
        if(instance && !(instance instanceof Hotfile)) 
            throw(new Error(`moveTo: expects Hotfile instace or null, ${instance} provided`))
        let destDir = this.parent
        if(instance) destDir = instance.isFile ? instance.parent : instance.path
        const to = p.join(destDir, this.basename)
        if(force || !await this.exists(to)) await this.rename(this.path, to)
        return new Hotfile(to)
    }

    /* FOLDER FUNCTIONS */

    createFolderSync(name, options = { recursive: true }){
        const path = p.join(this.path, name)
        this.mkdirSync(path, options)
        if(!options.force && this.existsSync(path)) return new Hotfile(path)
        const folder = new Hotfile(path)
        this.children.push(folder)
        return folder
    }

    async createFolder(name, options = { recursive: true }){
        const path = p.join(this.path, name)
        await this.mkdir(path, options)
        if(!options.force && await this.exists(path)) return new Hotfile(path)
        const folder = new Hotfile(path)
        this.children.push(folder)
        return folder
    }

    async loadChildren(options = {}){
        const { depth } = options
        this.children = await this.loaddir(this.path, depth, options)
        return this
    }

    async loaddir(path, depth = 0, options = {}){
        const { id, cb, files, exclude, include, $include, $exclude, allow } = options
        let items = await fs.promises.readdir(path)

        /* FILTERS */
        if(exclude) items = items.filter(o => !exclude.includes(o))
        if(include) items = items.filter(o => include.includes(o))
        if($exclude) items = items.filter(o => !$exclude.find(regex => (regex).test(o)))
        if($include) items = items.filter(o => $include.find(regex => (regex).test(o)))

        items = items.map(o => new Hotfile(p.join(path, o)))

        for(let i = 0; i < items.length; i++){

            /* options */
            if(cb) await cb(items[i])
            if(id) items[i].id = this.md5Id(items[i].path)
            if(files && items[i].isFile) {
                if(!this.files) this.files = []
                if(allow){
                    const ext = items[i].ext.toLowerCase()
                    if(allow.includes(ext)) this.files.push(items[i])
                }else{
                    this.files.push(items[i])
                }
            }

            if(!items[i].isFile && depth > 0){
                items[i].children = await this.loaddir(items[i].path, depth - 1, options)
            }
        }
        return items
    }
}

exports = module.exports = (path = null) => {
    if(!path) throw(new HotfileError(`hotfile requires a directory path, ${path} provided`))
    return new Hotfile(path)
}

exports.Hotfile = Hotfile
exports.HotfileError = HotfileError