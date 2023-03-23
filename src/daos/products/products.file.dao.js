import path from 'path'
import Container from '../../containers/file.container.js'

export class ProductsDAO extends Container {
  constructor() {
    super(path.join('src/db/products.json'))
  }
}
