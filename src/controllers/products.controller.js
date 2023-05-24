"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductBySlug = exports.createProduct = exports.getProducts = void 0;
const products_dao_1 = __importDefault(require("../dao/mongo/products.dao"));
const app_config_1 = __importDefault(require("../config/app.config"));
const productsDAO = new products_dao_1.default();
const getProducts = async (req, res) => {
    const { category } = req.query;
    try {
        // const products = productService.findAllByTags(tags as string[])
        const products = category
            ? await productsDAO.findAllByCategory(category)
            : await productsDAO.findAll();
        return res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 500, message: 'Internal server error' });
    }
};
exports.getProducts = getProducts;
const createProduct = async (req, res) => {
    const image = req.file;
    const { title, description, category, price } = req.body;
    // Validamos que el payload sea correcto
    if (!title || !description || !price || !category) {
        return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' });
    }
    try {
        const product = await productsDAO.create({
            title,
            description,
            category,
            price,
            slug: title.toLowerCase().replace(/ /g, '-'),
            images: [`${req.protocol}://${req.hostname}:${app_config_1.default.port}/uploads/${image?.filename ?? 'placeholder.webp'}`]
        });
        return res.status(201).json(product);
    }
    catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 400, message: 'Product already exists' });
        }
        console.log(error);
        return res.status(500).json({ error: 500, message: 'Internal server error' });
    }
};
exports.createProduct = createProduct;
const getProductBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const product = await productsDAO.findBySlug(slug);
        if (!product) {
            return res.status(404).json({ error: 404, message: 'Product not found' });
        }
        return res.status(200).json(product);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 500, message: 'Internal server error' });
    }
};
exports.getProductBySlug = getProductBySlug;
// export const getProductById = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { id } = req.params
//     const product = await productService.findById(id)
//     return res.status(200).json(product)
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ error: 500, message: 'Internal server error' })
//   }
// }
// export const createProduct = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const image = req.file
//     const { title, description, price, tags } = req.body
//     // Validamos que el payload sea correcto
//     if (!title || !description || !price || tags.length < 1) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }
//     const product = await productService.create({
//       title,
//       description,
//       price,
//       images: [`${req.protocol}://${req.hostname}:${configurations.port}/uploads/${image?.filename ?? 'placeholder.webp'}`],
//       tags
//     })
//     return res.status(201).json(product)
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ error: 500, message: 'Internal server error' })
//   }
// }
// export const updateProduct = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { id } = req.params
//     const { title, description, price, tags } = req.body
//     // Validamos que el payload sea correcto
//     if (!title || !description || !price || tags.length < 1) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }
//     const product = await productService.update(id, {
//       title,
//       description,
//       price,
//       images: [],
//       tags
//     })
//     return res.status(200).json(product)
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({ error: 500, message: 'Internal server error' })
//   }
// }
// export default {
//   getProducts,
//   getProductById,
//   createProduct,
//   updateProduct
// }
