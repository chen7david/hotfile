# Hotfile

### Usage

#### instantiation
```js
const { Hotfolder, Hotfile, Hot } = require('hotfile')
// const myfolder = require('hotfile')('./myfolder')
const dirpath = './myfolder' 
const filepath = './myfile.txt'
const myfolder = new Hotfolder(dirpath)
const myfile = new Hotfile(filepath)

const someAsyncFucn = async () => {

    // 1. create sub-folders
    const sub1folder = await myfolder.createFolder('subfolder-01')
    const sub2folder = await myfolder.createFolder('subfolder-02')

    // 2. create file in folder
    const file = await subfolder.create('summer.js')

    // 3. move file to another folder
    await file.setNameTo('water').setBasenameTo('nemo.mp4').moveTo(sub2folder)

    // 4. load subfolders with their files
    await myfolder.laodChildren()

    // 5. load subfolders, their files and for callback for each child
    const cb = async (item) => {
        if(item.isFile){
            // later files here
        }else {
            // later folders here
        }
    } 
    await myfolder.laodChildren({cb})

    // 6. ignore children that are included
    await myfolder.laodChildren({
        cb,
        exclude: ['node_modules', 'exact_name_of_unwated_file', 'DS_Store']
    })

    // 7. exclude all hidden files
    await myfolder.laodChildren({
        cb,
        deny: [ /(^|\/)\.[^\/\.]/g, /.*\.mp4/g]
    })
}
```