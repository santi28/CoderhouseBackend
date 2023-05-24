"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompiledTemplate = exports.Layouts = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
var Layouts;
(function (Layouts) {
    Layouts["NEW_REGISTER"] = "new_register";
    Layouts["FORGOT_PASSWORD"] = "forgot_password";
    Layouts["NEW_ORDER"] = "new_order";
})(Layouts = exports.Layouts || (exports.Layouts = {}));
function getCompiledTemplate(layout) {
    const layoutSource = fs_1.default.readFileSync(path_1.default.join(__dirname, `../../utils/mailer/${layout}.layout.hbs`), 'utf8');
    return handlebars_1.default.compile(layoutSource);
}
exports.getCompiledTemplate = getCompiledTemplate;
function getCompiledHTML(layout, data) {
    const template = getCompiledTemplate(layout);
    return template(data);
}
exports.default = getCompiledHTML;
