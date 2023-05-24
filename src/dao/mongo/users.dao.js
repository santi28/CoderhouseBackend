"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./models/user.model"));
const bcrypt_helper_1 = require("../../utils/bcrypt.helper");
class UsersDAO {
    async create(user) {
        console.log('Creating user...');
        const hashedPassword = (0, bcrypt_helper_1.hashPassword)(user.password);
        const newUser = new user_model_1.default({
            ...user,
            password: hashedPassword
        });
        console.log('Saving user...');
        return await newUser.save();
    }
    async findByEmail(email) {
        return await user_model_1.default.findOne({ email });
    }
    async findByRecoveryCode(recoveryCode) {
        return await user_model_1.default.findOne({ recoveryCode });
    }
    async findById(id) {
        return await user_model_1.default.findById(id);
    }
    async update(id, user) {
        return await user_model_1.default.findByIdAndUpdate(id, user);
    }
    async updatePassword(id, password) {
        const hashedPassword = (0, bcrypt_helper_1.hashPassword)(password);
        return await user_model_1.default.findByIdAndUpdate(id, {
            password: hashedPassword,
            $unset: { recoveryCode: 1 }
        });
    }
}
exports.default = UsersDAO;
