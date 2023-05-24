"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// Retorna un hash en base a un password
function hashPassword(password) {
    const salt = bcrypt_1.default.genSaltSync(10);
    const hash = bcrypt_1.default.hashSync(password, salt);
    return hash;
}
exports.hashPassword = hashPassword;
// Compara un password en texto plano con un hash
function comparePassword(password, hash) {
    return bcrypt_1.default.compareSync(password, hash);
}
exports.comparePassword = comparePassword;
