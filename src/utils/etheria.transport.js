"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'sid75@ethereal.email',
        pass: '5khmtZBX5ja62A79Gs'
    }
});
exports.default = transporter;
