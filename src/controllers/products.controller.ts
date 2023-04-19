import { Request, Response } from 'express'
import productModel from '../dao/mongo/product.model'
import configurations from '../config/app.config'

export const getProducts = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await productModel.find()

    return res.status(200).json(products)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params
    const product = await productModel.findById(id)

    return res.status(200).json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const image = req.file
    const { name, description, price } = req.body

    // Validamos que el payload sea correcto
    if (!name || !description || !price) { return res.status(400).json({ error: 400, message: 'Invalid or incomplete payload' }) }

    const product = await productModel.create({
      name,
      description,
      price,
      image: `${req.protocol}://${req.hostname}:${configurations.port}/uploads/${image?.filename ?? 'placeholder.webp'}`
    })

    return res.status(201).json(product)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, message: 'Internal server error' })
  }
}

export default {
  getProducts,
  getProductById,
  createProduct
}
