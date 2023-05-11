import { Document } from 'mongoose'
import ProductModel from './models/product.model'

export interface Product {
  title: string
  description: string
  price: number
  images: string[]
  tags: string[]
}

export type ProductDocument = Product & Document

export default class ProductsDAO {
  // Crea un nuevo producto
  public async create (product: Product) {
    const newProduct = new ProductModel(product)
    return await newProduct.save()
  }

  // Obtiene el listado de productos
  public async findAll () {
    return await ProductModel.find()
  }

  public async findAllByTags (tags: string[]) {
    return await ProductModel.find({ tags: { $in: tags } })
  }

  public async findById (id: string) {
    return await ProductModel.findById(id)
  }

  public async update (id: string, product: Product) {
    return await ProductModel.findByIdAndUpdate(id, product, { new: true })
  }

  public async delete (id: string) {
    return await ProductModel.findByIdAndDelete(id)
  }
}
