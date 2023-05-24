"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_model_1 = __importDefault(require("./models/product.model"));
class ProductsDAO {
    async create(product) {
        const newProduct = new product_model_1.default(product);
        return await newProduct.save();
    }
    async findAll() {
        return await product_model_1.default.find();
    }
    async findAllByCategory(category) {
        return await product_model_1.default.find({ category });
    }
    async findById(id) {
        return await product_model_1.default.findById(id);
    }
    async findBySlug(slug) {
        return await product_model_1.default.findOne({ slug });
    }
}
exports.default = ProductsDAO;
