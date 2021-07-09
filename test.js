global.v = (v) => console.log(v)
const app = new (require('koa'))
const rootdir = 'home'
const folder = require('./index')(rootdir)

const SOME_FOLDER_PATH = 'home'
const ANOTHER_FOLDER_PATH = 'home2'
const SOME_FILE_PATH = 'home/a/a subtitle file.en.srt'
const aHotFolder = require('./index')(SOME_FOLDER_PATH)
// const aHotFile = require('./index')(SOME_FILE_PATH)
const anotherHotFolder = require('./index')(ANOTHER_FOLDER_PATH)

app.use(async (ctx) => {
    // await anotherHotFolder.loadChildren({
    //     id:true,
    //     depth: 5,
    //     files: true,
    //     cb: async (item) => {
    //         await item.delete()
    //     }
    // })
    console.log(aHotFolder.md5Id(new Date().toISOString()))

    const foldername = 'some-name-not-a-path'
    const aHotFolderB = aHotFolder.createFolderSync(foldername)
    ctx.body = aHotFolder
})


app.listen(3000)

