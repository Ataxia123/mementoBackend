"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileWrap = void 0;
const locales_1 = __importDefault(require("../locales"));
class FileWrap {
    _file;
    get file() {
        return this._file;
    }
    get name() {
        return this._file.name;
    }
    get extension() {
        return this.name.toLowerCase().split(".").pop() || "";
    }
    get size() {
        return this._file.size;
    }
    readData({ asURL } = {}) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                }
                else {
                    reject(new Error(locales_1.default.Upload.ParseDataURLFailed));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            if (asURL) {
                reader.readAsDataURL(this.file);
            }
            else {
                reader.readAsText(this.file);
            }
        });
    }
    constructor(file) {
        this._file = file;
    }
}
exports.FileWrap = FileWrap;
