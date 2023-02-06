import Container from '../../containers/file.container.js'

export class CartsDAO extends Container {
  constructor() {
    super('src/db/carts.json')
  }
}