'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.Hotfile = void 0
const fs_1 = __importDefault(require('fs'))
const path_1 = require('path')
const crypto_1 = require('crypto')
const md5 = (seed) => (0, crypto_1.createHash)('md5').update(seed).digest('hex')
class Hotfile {
  constructor(path, options) {
    var _a, _b
    if (!Hotfile.existsSync(path)) throw new Error('Invalid path: ' + path)
    const { ext, name, base } = (0, path_1.parse)(path)
    const stat = fs_1.default.lstatSync(path)
    this.isDirectory = stat.isDirectory()
    this.name = name
    this.path = (0, path_1.resolve)(path)
    this.base = base
    this.size = stat.size
    this.isDirectory ? (this.children = []) : (this.ext = ext)
    if (
      (_a =
        options === null || options === void 0
          ? void 0
          : options.extendedProperties) === null || _a === void 0
        ? void 0
        : _a.includes('stat')
    )
      this.stat = stat
    if (
      (_b =
        options === null || options === void 0
          ? void 0
          : options.extendedProperties) === null || _b === void 0
        ? void 0
        : _b.includes('id')
    )
      this.id = md5(this.path)
  }
  static existsSync(path) {
    let flag = true
    try {
      fs_1.default.accessSync(path, fs_1.default.constants.F_OK)
    } catch (e) {
      flag = false
    }
    return flag
  }
  loadChildren(options, depthTracker = 1) {
    var _a
    return __awaiter(this, void 0, void 0, function* () {
      const fileNames = yield fs_1.default.promises.readdir(this.path)
      depthTracker++
      for (let i = 0; i < fileNames.length; i++) {
        const path = (0, path_1.resolve)(this.path, fileNames[i])
        const hotfile = new Hotfile(path, options)
        ;(_a = this.children) === null || _a === void 0
          ? void 0
          : _a.push(hotfile)
        if (
          hotfile.isDirectory &&
          depthTracker <=
            ((options === null || options === void 0
              ? void 0
              : options.depth) || 1)
        ) {
          yield hotfile.loadChildren(options, depthTracker)
        }
      }
      return this
    })
  }
}
exports.Hotfile = Hotfile
//# sourceMappingURL=index.js.map
