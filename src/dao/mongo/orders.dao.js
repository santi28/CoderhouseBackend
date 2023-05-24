"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = __importDefault(require("./models/order.model"));
class ProductsDAO {
    async create(product) {
        const newProduct = new order_model_1.default(product);
        return await newProduct.save();
    }
    async findAll() {
        return await order_model_1.default.find();
    }
    async findAllByUser(user) {
        return await order_model_1.default.find({ user });
    }
    async findById(id) {
        return await order_model_1.default.findById(id);
    }
}
exports.default = ProductsDAO;
