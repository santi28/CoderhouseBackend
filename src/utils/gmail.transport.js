"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = __importDefault(require("../config/app.config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    port: app_config_1.default.app.mailer.port ?? 587,
    auth: app_config_1.default.app.mailer.auth
});
exports.default = transporter;
