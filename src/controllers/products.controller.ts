import { Request, Response } from 'express'
import ProductsDAO, { Product } from '../dao/mongo/products.dao'
import configurations from '../config/app.config'

const productsDAO = new ProductsDAO()

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  const { category } = req.query

  try {
    // const products = productService.findAllByTags(tags as string[])
    const products = category
      ? await productsDAO.findAllByCategory(category as string)
      : await productsDAO.findAll()

    return res.status(200).json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export const createProduct = async (req: Request, res: Response): Promise<any> => {
  const image = req.file
  const { title, description, category, price } = req.body as Product

  // Validamos que el payload sea correcto
  if (!title || !description || !price || !category) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

  try {
    const product = await productsDAO.create({
      title,
      description,
      category,
      price,
      slug: title.toLowerCase().replace(/ /g, '-'),
      images: [`${req.protocol}://${req.hostname}:${configurations.port}/uploads/${image?.filename ?? 'placeholder.webp'}`]
    })

    return res.status(201).json(product)
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 400, message: 'Product already exists' })
    }

    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

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
