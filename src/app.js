"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Modulos de terceros
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Modulos de configuración
const app_config_1 = __importDefault(require("./config/app.config"));
const mongodb_config_1 = __importDefault(require("./config/mongodb.config"));
const passport_config_1 = __importDefault(require("./config/passport.config"));
const templateEnginge_config_1 = __importDefault(require("./config/templateEnginge.config"));
// Modulo de router
const index_router_1 = __importDefault(require("./routes/index.router"));
const cors_1 = __importDefault(require("cors"));
void (async () => {
    const app = (0, express_1.default)();
    await (0, mongodb_config_1.default)();
    const port = app_config_1.default.port;
    // Inicializamos el motor de plantillas
    await (0, templateEnginge_config_1.default)(app);
    // Middlewares
    app.use((0, cors_1.default)());
    app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    // Inicializamos passport con la estrategia local y autenticación con JWT
    (0, passport_config_1.default)();
    // Configuramos las rutas
    app.use('/', index_router_1.default);
    app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
})();
