import Container from '../../containers/mongo.container.js'
import Product from '../../models/products.model.js'

export class CartsDAO extends Container {
  constructor() {
    super(Product)
  }
}
