"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    orderNumber: { type: Number, required: true },
    products: [
        {
            product: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ],
    total: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    address: { type: String, required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Order', ProductSchema);
