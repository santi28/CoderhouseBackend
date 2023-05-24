"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accounts_router_1 = __importDefault(require("./accounts.router"));
const products_router_1 = __importDefault(require("./products.router"));
const orders_router_1 = __importDefault(require("./orders.router"));
const app_router_1 = __importDefault(require("./app.router"));
const carts_router_1 = __importDefault(require("./carts.router"));
const router = (0, express_1.Router)();
router.use('/', app_router_1.default);
router.use('/api/accounts', accounts_router_1.default);
router.use('/api/products', products_router_1.default);
router.use('/api/carts', carts_router_1.default);
router.use('/api/orders', orders_router_1.default);
exports.default = router;
