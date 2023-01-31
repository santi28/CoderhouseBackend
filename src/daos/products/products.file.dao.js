import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Container from '../../containers/file.container.js'

export class ProductsDAO extends Container {
  constructor() {
    super(path.join('src/db/products.json'))
  }
}