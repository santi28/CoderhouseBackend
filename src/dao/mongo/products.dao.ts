import { Document } from 'mongoose'
import ProductModel from './models/product.model'

export interface Product {
  title: string
  description: string
  price: number
  category: string
  images: string[]
  slug: string
}

export type ProductDocument = Product & Document

export default class ProductsDAO {
  public async create (product: Product) {
    const newProduct = new ProductModel(product)
    return await newProduct.save()
  }

  public async findAll () {
    return await ProductModel.find()
  }

  public async findAllByCategory (category: string) {
    return await ProductModel.find({ category })
  }

  public async findById (id: string) {
    return await ProductModel.findById(id)
  }

  public async findBySlug (slug: string) {
    return await ProductModel.findOne({
      slug,
      deleted: false
    })
  }
}
