const Hotfile = require('./models/Hotfile')
const Hotfolder = require('./models/Hotfolder')
const Hot = require('./models/Hot')

exports = module.exports = (path) => new Hotfolder(path)

exports.Hotfile = Hotfile
exports.Hotfolder = Hotfolder
exports.Hot = Hot