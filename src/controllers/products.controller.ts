import { Request, Response } from 'express'
import ProductService from '../dao/mongo/products.dao'
import configurations from '../config/app.config'

const productService = new ProductService()

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  const { tags } = req.query

  try {
    // const products = productService.findAllByTags(tags as string[])

    const products = tags ? await productService.findAllByTags(tags as string[]) : await productService.findAll()

    return res.status(200).json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params
    const product = await productService.findById(id)

    return res.status(200).json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const image = req.file
    const { title, description, price, tags } = req.body

    // Validamos que el payload sea correcto
    if (!title || !description || !price || tags.length < 1) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

    const product = await productService.create({
      title,
      description,
      price,
      images: [`${req.protocol}://${req.hostname}:${configurations.port}/uploads/${image?.filename ?? 'placeholder.webp'}`],
      tags
    })

    return res.status(201).json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params
    const { title, description, price, tags } = req.body

    // Validamos que el payload sea correcto
    if (!title || !description || !price || tags.length < 1) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

    const product = await productService.update(id, {
      title,
      description,
      price,
      images: [],
      tags
    })

    return res.status(200).json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct
}
