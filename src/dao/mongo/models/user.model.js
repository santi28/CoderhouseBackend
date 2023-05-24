"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    recoveryCode: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    deleted: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', UserSchema);
