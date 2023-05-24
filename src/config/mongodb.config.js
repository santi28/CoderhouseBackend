"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_config_1 = __importDefault(require("./app.config"));
async function connectToDatabase() {
    const { db } = app_config_1.default;
    try {
        // Evadimos el warning de mongoose por utilizar strictQuery
        mongoose_1.default.set('strictQuery', false);
        // Conectamos a la base de datos
        if (!db.username || !db.password) {
            if (!db.uri)
                throw new Error('❌ DB URI is required');
            console.log('ℹ️ Connecting to MongoDB with URI');
            await mongoose_1.default.connect(db.uri, {
                dbName: db.name
            });
        }
        else {
            console.log('ℹ️ Connecting to MongoDB with credentials');
            await mongoose_1.default.connect(`mongodb://${db.host}:${db.port}`, {
                dbName: db.name,
                authSource: 'admin',
                user: db.username,
                pass: db.password
            });
        }
        return console.log('✅ Connected to MongoDB database successfully');
    }
    catch (error) {
        console.error(error);
        console.error('❌ Error while trying to connect to MongoDB');
        return process.exit(1);
    }
}
exports.default = connectToDatabase;
