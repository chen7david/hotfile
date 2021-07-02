global.z = (v) => console.log(v)
const { Hotfolder, Hotfile, Hot } = require('./index')
// const myfolder = require('hotfile')('./myfolder')
const dirpath = './myfolder'
const filepath = './myfile.txt'
const myfolder = new Hotfolder(dirpath)
const myfile = new Hotfile(filepath)

const someAsyncFucn = async () => {
    // create sub-folders
    const subfolder = await myfolder.createFolder('subfolder-03')
    z({subfolder})
    const file = await subfolder.create('winter.js')
    
}

someAsyncFucn()