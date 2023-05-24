"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = require("express-handlebars");
async function initTemplateEngine(app) {
    const hbs = (0, express_handlebars_1.engine)({
        extname: 'hbs',
        layoutsDir: path_1.default.join(__dirname, '../views/layouts'),
        partialsDir: path_1.default.join(__dirname, '../views/partials'),
        defaultLayout: 'main',
        helpers: {
            ifEquals: function (arg1, arg2, options) {
                return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
            }
        }
    });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    app.engine('hbs', hbs);
    app.set('view engine', 'hbs');
    app.set('views', './src/views');
}
exports.default = initTemplateEngine;
