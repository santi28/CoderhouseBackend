"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cart_model_1 = __importDefault(require("./models/cart.model"));
const mongoose_1 = require("mongoose");
class CartDAO {
    async getAllCarts() {
        try {
            const carts = await cart_model_1.default.find()
                .populate('user')
                .populate('products.product');
            return carts;
        }
        catch (error) {
            throw new Error('Error al obtener los carritos');
        }
    }
    async getCartByUser(userId) {
        try {
            const cart = await cart_model_1.default.findOne({ user: userId })
                .populate('user')
                .populate('products.product');
            return cart;
        }
        catch (error) {
            throw new Error('Error al obtener el carrito del usuario');
        }
    }
    async addProductToCart(userId, productId, quantity) {
        try {
            // Obtenemos el carrito del usuario (si existe)
            const cart = await cart_model_1.default.findOne({ user: userId });
            if (cart) {
                // Si el carrito ya existe, verificamos que el producto no exista
                const isProductInCart = cart.products.some((item) => item.product._id.toString() === productId);
                if (isProductInCart) {
                    // Si el producto existe en el carrito, actualizamos la cantidad
                    cart.products = cart.products.map((item) => {
                        if (item.product._id.toString() === productId) {
                            item.quantity += quantity;
                        }
                        return item;
                    });
                    return await cart.save();
                }
                // Si el producto no existe en el carrito, lo agregamos
                cart.products.push({ product: new mongoose_1.Types.ObjectId(productId), quantity });
                return await cart.save();
            }
            else {
                return await cart_model_1.default.create({
                    user: userId,
                    products: [{ product: new mongoose_1.Types.ObjectId(productId), quantity }]
                });
            }
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async updateProductQuantity(userId, productId, quantity) {
        try {
            const cart = await cart_model_1.default.findOne({ user: userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.map((item) => {
                if (item.product._id.toString() === productId) {
                    item.quantity = quantity;
                }
                return item;
            });
            return await cart.save();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deleteProductFromCart(userId, productId) {
        try {
            const cart = await cart_model_1.default.findOne({ user: userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter((item) => item.product._id.toString() !== productId);
            return await cart.save();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deleteCart(userId) {
        try {
            const cart = await cart_model_1.default.findOne({ user: userId });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = [];
            return await cart.save();
        }
        catch (error) {
            throw new Error(error);
        }
    }
}
exports.default = CartDAO;
