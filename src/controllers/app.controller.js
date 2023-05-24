"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.order = exports.logout = exports.login = exports.register = exports.placedOrder = exports.confirmOrder = exports.addProduct = exports.product = exports.categories = exports.home = void 0;
const axios_1 = __importDefault(require("axios"));
const app_config_1 = __importDefault(require("../config/app.config"));
const carts_dao_1 = __importDefault(require("../dao/mongo/carts.dao"));
const cartDAO = new carts_dao_1.default();
const home = async (req, res) => {
    // Obtenemos los productos
    const { data: products } = await axios_1.default.get(`http://${req.hostname}:${app_config_1.default.port}/api/products`);
    res.render('index', { session: req.user, products });
};
exports.home = home;
const categories = async (req, res) => {
    const categories = {
        games: 'Videojuegos',
        consoles: 'Consolas'
    };
    const { id } = req.params;
    const category = categories[id];
    if (!category) {
        res.redirect('/');
        return;
    }
    // Obtenemos los productos
    const { data: products } = await axios_1.default.get(`http://${req.hostname}:${app_config_1.default.port}/api/products?category=${id}`);
    res.render('category', { session: req.user, products, category });
};
exports.categories = categories;
const product = async (req, res) => {
    const { id } = req.params;
    try {
        const { data: product } = await axios_1.default.get(`http://${req.hostname}:${app_config_1.default.port}/api/products/${id}`);
        if (!product) {
            res.redirect('/');
            return;
        }
        res.render('product', { session: req.user, product });
    }
    catch (error) {
        res.redirect('/');
    }
};
exports.product = product;
const addProduct = (req, res) => {
    res.render('products/add', { session: req.user });
};
exports.addProduct = addProduct;
const confirmOrder = async (req, res) => {
    const { id } = req.user;
    console.log(id);
    const cart = await cartDAO.getCartByUser(id);
    if (!cart || cart.products.length === 0) {
        res.redirect('/');
        return;
    }
    const jsonCart = cart.toJSON();
    let subtotal = 0;
    // Agregamos el total de cada producto
    jsonCart.products = jsonCart.products.map((product) => {
        product.total = product.product.price * product.quantity;
        subtotal += product.total;
        return product;
    });
    res.render('orders/confirm', { session: req.user, cart: jsonCart, subtotal });
};
exports.confirmOrder = confirmOrder;
const placedOrder = async (req, res) => {
    res.render('orders/placed', { session: req.user });
};
exports.placedOrder = placedOrder;
const register = (req, res) => {
    res.render('register');
};
exports.register = register;
const login = (req, res) => {
    res.render('login');
};
exports.login = login;
const logout = (req, res) => {
    res.clearCookie(app_config_1.default.app.jwt.cookie);
    res.render('logout');
};
exports.logout = logout;
const order = async (req, res) => {
    const { id } = req.params;
    const { data: order } = await axios_1.default.get(`http://${req.hostname}:${app_config_1.default.port}/api/orders/${id}`);
    res.render('order', { session: req.user, order });
};
exports.order = order;
