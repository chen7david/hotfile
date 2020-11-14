const Hotile = require('./index')
const dd = (val) => console.log(val)
const p = require('path')
const Hotfile = require('./index')
const dirpath = p.resolve(__dirname, '../', 'dirtest')

const run = async () => {
    const map = await Hotfile.map(dirpath, {
        exclude: [
            /(^|\/)\.[^\/\.]/g,
            /@eaDir/g,
        ]
    })
    dd({map})
}

run()