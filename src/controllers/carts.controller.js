"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCart = exports.deleteProductFromCart = exports.updateProductQuantity = exports.addProductToCart = exports.getCart = void 0;
const carts_dao_1 = __importDefault(require("../dao/mongo/carts.dao"));
const products_dao_1 = __importDefault(require("../dao/mongo/products.dao"));
const cartsDAO = new carts_dao_1.default();
const productsDAO = new products_dao_1.default();
// Obtiene el carrito del usuario logueado
const getCart = async (req, res) => {
    const { id: userId } = req.user;
    try {
        const cart = await cartsDAO.getCartByUser(userId);
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCart = getCart;
const addProductToCart = async (req, res) => {
    const { id: userId } = req.user;
    const { productId, quantity } = req.body;
    console.log(req.body);
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    try {
        const product = await productsDAO.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const cart = await cartsDAO.addProductToCart(userId, productId, quantity);
        res.status(201).json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addProductToCart = addProductToCart;
const updateProductQuantity = async (req, res) => {
    const { id: userId } = req.user;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    try {
        const product = await productsDAO.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const cart = await cartsDAO.updateProductQuantity(userId, productId, quantity);
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProductQuantity = updateProductQuantity;
const deleteProductFromCart = async (req, res) => {
    const { id: userId } = req.user;
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({ message: 'Faltan datos' });
    }
    try {
        const product = await productsDAO.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const cart = await cartsDAO.deleteProductFromCart(userId, productId);
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProductFromCart = deleteProductFromCart;
const deleteCart = async (req, res) => {
    const { id: userId } = req.user;
    try {
        const cart = await cartsDAO.deleteCart(userId);
        res.json(cart);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteCart = deleteCart;
