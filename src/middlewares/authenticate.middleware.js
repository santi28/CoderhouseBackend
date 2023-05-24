"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeFrontendPolicy = exports.executePolicy = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = __importDefault(require("../config/app.config"));
const executePolicy = (policies) => {
    return (req, res, next) => {
        if (policies[0] === 'PUBLIC')
            return next();
        const token = req.cookies[app_config_1.default.app.jwt.cookie];
        // Verificamos que el token exista, si no, redirigimos al login
        if (!token)
            return res.status(401).json({ error: 401, message: 'Unauthorized' });
        try {
            // Decodificamos el token y verificamos el rol del usuario
            const decoded = jsonwebtoken_1.default.verify(token, app_config_1.default.app.jwt.secret);
            console.log('URL => ', req.url, 'POLICIES => ', policies, 'DECODED => ', decoded.role);
            if (policies[0] !== 'AUTHENTICATED' &&
                !policies.includes(decoded.role))
                return res.status(401).json({ error: 401, message: 'Unauthorized' });
            // Si el token es válido, lo añadimos a la request
            req.user = decoded;
            return next();
        }
        catch (error) {
            res.clearCookie(app_config_1.default.app.jwt.cookie);
            return res.status(401).json({ error: 401, message: 'Unauthorized' });
        }
    };
};
exports.executePolicy = executePolicy;
const executeFrontendPolicy = (policies) => {
    return (req, res, next) => {
        if (policies[0] === 'PUBLIC')
            return next();
        const token = req.cookies[app_config_1.default.app.jwt.cookie];
        // Verificamos que el token exista, si no, redirigimos al login
        if (!token)
            return res.redirect('/login');
        try {
            // Decodificamos el token y verificamos el rol del usuario
            const decoded = jsonwebtoken_1.default.verify(token, app_config_1.default.app.jwt.secret);
            console.log('URL => ', req.url, 'POLICIES => ', policies, 'DECODED => ', decoded.role);
            if (policies[0] !== 'AUTHENTICATED' &&
                !policies.includes(decoded.role))
                return res.redirect('/login');
            // Si el token es válido, lo añadimos a la request
            req.user = decoded;
            return next();
        }
        catch (error) {
            res.clearCookie(app_config_1.default.app.jwt.cookie);
            return res.redirect('/login');
        }
    };
};
exports.executeFrontendPolicy = executeFrontendPolicy;
