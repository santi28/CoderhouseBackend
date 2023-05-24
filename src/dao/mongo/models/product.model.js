"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ProductSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, min: 1, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }],
    slug: { type: String, required: true, unique: true }
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Product', exports.ProductSchema);
