"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordByRecoveryCode = exports.forgotPassword = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = __importDefault(require("../config/app.config"));
const comunications_service_1 = require("../services/comunications.service");
const users_dao_1 = __importDefault(require("../dao/mongo/users.dao"));
const layout_helper_1 = __importStar(require("../utils/mailer/layout.helper"));
const userDAO = new users_dao_1.default();
const register = async (req, res) => {
    try {
        const avatar = req.file; // Obtenemos el avatar del usuario
        const { name, email, password, phone } = req.body; // Obtenemos los datos del usuario
        // Validamos que el payload sea correcto
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' });
        }
        // Utilizamos el dao para crear el usuario
        const user = await userDAO.create({
            name,
            email,
            password,
            phone,
            avatar: avatar?.filename
        });
        // Generamos el html del correo
        const html = (0, layout_helper_1.default)(layout_helper_1.Layouts.NEW_REGISTER, {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
        // Enviamos un correo al administrador con los datos del usuario
        void (0, comunications_service_1.sendEmail)(app_config_1.default.app.administrator.email, 'Nuevo usuario registrado', html);
        // Devolvemos el usuario creado
        return res.status(201).json(user);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 409, message: 'User already exists' });
        }
        console.error(error);
        return res.status(500).json({ error: 500, message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    // Obtenemos los datos del usuario provenientes del passport
    const user = req.user;
    // Generamos el contenido del token
    const tokenPayload = { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar };
    // Firmamos y generamos el token con una duracion de 1 hora
    const token = jsonwebtoken_1.default.sign(tokenPayload, app_config_1.default.app.jwt.secret, { expiresIn: '1h' });
    // Devolvemos el token y los datos del usuario
    return res
        .cookie(app_config_1.default.app.jwt.cookie, token)
        .json({ ...tokenPayload, accessToken: token });
};
exports.login = login;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // Validamos que el payload sea correcto
    if (!email) {
        return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' });
    }
    // Obtenemos el usuario por el email
    const user = await userDAO.findByEmail(email);
    // Si el usuario no existe, se devuelve un error
    if (!user) {
        return res.status(404).json({ error: 404, message: 'User not found' });
    }
    // Generamos el OTP para el usuario
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Actualizamos el usuario con el OTP
    await userDAO.update(user._id.toString(), { recoveryCode: otp.toString() });
    // Generamos el html del correo
    const html = (0, layout_helper_1.default)(layout_helper_1.Layouts.FORGOT_PASSWORD, {
        name: user.name,
        email: user.email,
        url: `http://localhost:8080/reset-password?token=${otp}`
    });
    // Enviamos un correo al usuario con el OTP
    void (0, comunications_service_1.sendEmail)(user.email, 'Recuperación de contraseña', html);
    // Devolvemos un OK indicando que el correo fue enviado
    return res.status(200).json({ message: 'Email sent' });
};
exports.forgotPassword = forgotPassword;
const resetPasswordByRecoveryCode = async (req, res) => {
    const { recoveryCode, password } = req.body;
    // Validamos que el payload sea correcto
    if (!recoveryCode || !password) {
        return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' });
    }
    // Obtenemos el usuario por el OTP
    const user = await userDAO.findByRecoveryCode(recoveryCode);
    // Si el usuario no existe, se devuelve un error
    if (!user) {
        return res.status(404).json({ error: 404, message: 'User not found' });
    }
    // Actualizamos el usuario con la nueva contraseña
    await userDAO.updatePassword(user._id.toString(), password);
    // Devolvemos un OK indicando que la contraseña fue actualizada
    return res.status(200).json({ message: 'Password updated' });
};
exports.resetPasswordByRecoveryCode = resetPasswordByRecoveryCode;
