# hotfile

```js
const directory = '/some/directory/path'
const file = '/some/file/path.ext'
const HF = require('hotfile')

const someAsyncFunction = async () => {
    const hotfiles = await HF.map(directory)
    const hotfile = new HF(file)
    const hotdir = hotfiles[0]
    const newdir = await hotdir.appendDirectory('subtitles')
}
```

```js
const hotdir = new HF(directory)
await hotdir.rename('newfilename', 'ext')

const hotfile = new HF(file)
await hotfile.moveTo(hotdir)
```
### Exclude all Hidden Files
```js
const items = await hotfile.map(someFolderPath, {
    exclude: /(^|\/)\.[^\/\.]/g,
    model: SomeModelThatInheritsFromHotfile
})
```

### Create a Hotfile Wrapper Class
Note that all wrapper class objects must inherit from the Hotfile class.

```js
const HF = require('hotfile')

class SomeName extends HF {
    constructor(path){
        super(path)
        // write your code here ... 
    }
}
```

### Some Usefull Methods you might want to use in your wrapper class

```js
const HF = require('hotfile')

class SomeName extends HF {
    constructor(path){
        super(path)
        // write your code here ... 
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

    static async mkdir(path){
        return fs.promises.mkdir(path, { recursive: true })
            .then(() => new Hotfile(path)).catch(() => false)
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
```