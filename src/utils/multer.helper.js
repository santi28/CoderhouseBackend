"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
// Definimos el storage para multer
exports.storage = multer_1.default.diskStorage({
    // Definimos el destino de los archivos
    destination: (req, file, cb) => {
        return cb(null, path_1.default.join(__dirname, '..', 'public', 'uploads'));
    },
    // Definimos el nombre del archivo
    filename: (req, file, cb) => {
        const uniqueName = (0, uuid_1.v4)() + path_1.default.extname(file.originalname);
        return cb(null, uniqueName);
    }
});
// Exportamos el uploader con la configuración de multer
exports.uploader = (0, multer_1.default)({ storage: exports.storage });
exports.default = exports.uploader;
