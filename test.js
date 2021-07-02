global.z = (v) => console.log(v)
const { Hotfolder, Hotfile, Hot } = require('./index')
// const myfolder = require('hotfile')('./myfolder')
const dirpath = './myfolder'
const filepath = './myfile.txt'
const myfolder = new Hotfolder(dirpath)
const myfile = new Hotfile(filepath) 

const someAsyncFucn = async () => {
    // create sub-folders
    const subfolder = await myfolder.createFolder('subfolder-05')
    // const subfolder2 = await subfolder.createFolder('subfolder-04')
    const file = await subfolder.create('summer.js')
    await file.setNameTo('water').moveTo(subfolder)
}

someAsyncFucn()