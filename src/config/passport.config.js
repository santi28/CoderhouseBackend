"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcrypt_helper_1 = require("../utils/bcrypt.helper");
const users_dao_1 = __importDefault(require("../dao/mongo/users.dao"));
const userDAO = new users_dao_1.default();
const initializePassport = () => {
    passport_1.default.use('login', new passport_local_1.Strategy({ usernameField: 'email' }, async (email, password, done) => {
        console.log('🔎 Verificando credenciales');
        console.log({ email, password });
        // Obtenemos el usuario por el email
        const user = await userDAO.findByEmail(email);
        // Si el usuario no existe, se devuelve un error
        if (!user) {
            return done(null, false, { message: 'Invalid user or password' });
        }
        // Si el usuario existe, se compara con la contraseña, sino la contraseña es vacia
        const isPasswordValid = (0, bcrypt_helper_1.comparePassword)(password, user?.password ?? '');
        // Si la contraseña no es valida, se devuelve un error
        if (!isPasswordValid) {
            return done(null, false, { message: 'Invalid user or password' });
        }
        return done(null, user); // Si todo sale bien, se devuelve el usuario
    }));
};
exports.initializePassport = initializePassport;
exports.default = exports.initializePassport;
