import knex from 'knex'

class Contenedor {
  /** @typedef {{id: number, [key: string]: string}} CustomObject */

  filename = 'data.json'

  /** @param {string} filename */
  constructor(config, table) {
    // this.filename = tablename ?? 'default'
    this.knex = knex(config)
    this.table = table
  }

  /** Guarda un objeto y devuelve su ID
   * @param {CustomObject} object
   * @returns {Promise<number>}
   */
  async save(object) {
    try {
      const savedObject = await this.knex(this.table).insert(object)
      return savedObject
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Devuelve un elemento en base a un ID
   * @param {number} id
   * @returns {Promise<CustomObject>}
   */
  async getById(id) {
    return await this.knex(this.table).select().where({ id })
  }

  /** Retrona todos los elementos
   * @returns {Promise<CustomObject[]>}
   */
  async getAll() {
    try {
      return await this.knex(this.table).select()
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Actualiza un elemento en base a un ID
   * @param {CustomObject} produ
   * @returns {Promise<number>}
   */
  async updateById(id, gettedProduct) {
    try {
      // Verificamos que el producto exista
      const product = await this.getById(id)
      if (!product) throw new Error('Producto no encontrado')

      const updatedProduct = await this.knex(this.table)
        .where({ id })
        .update(gettedProduct)
      return updatedProduct
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Borra un elemento en base a su id
   * @param {number} id
   */
  async deleteById(id) {
    try {
      await this.knex(this.table).where({ id }).del()
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Borra todos los elementos */
  async deleteAll() {
    try {
      await this.knex(this.table).del()
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default Contenedor
