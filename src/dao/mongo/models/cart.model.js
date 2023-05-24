"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CartSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, min: 1, required: true }
        }]
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Cart', exports.CartSchema);
