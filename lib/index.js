"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hotfile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
class Hotfile {
    constructor(path, options) {
        var _a;
        if (!Hotfile.existsSync(path))
            throw new Error('Invalid path: ' + path);
        const { ext, name, base } = (0, path_1.parse)(path);
        const x = (0, path_1.parse)(path);
        const stat = fs_1.default.lstatSync(path);
        this.isDirectory = stat.isDirectory();
        this.name = name;
        this.path = (0, path_1.resolve)(path);
        this.base = base;
        this.size = stat.size;
        this.isDirectory ? (this.children = []) : (this.ext = ext);
        if ((_a = options === null || options === void 0 ? void 0 : options.extendedProperties) === null || _a === void 0 ? void 0 : _a.includes('stat'))
            this.stat = stat;
    }
    static existsSync(path) {
        let flag = true;
        try {
            fs_1.default.accessSync(path, fs_1.default.constants.F_OK);
        }
        catch (e) {
            flag = false;
        }
        return flag;
    }
}
exports.Hotfile = Hotfile;
//# sourceMappingURL=index.js.map