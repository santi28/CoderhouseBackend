class Contenedor {
  /** @param {string} collection */
  constructor(collection) {
    // Establece una conexión con la base de datos utilizando mongoose y las env
    // variables de conexión definidas en el archivo .env
    this.mongoose = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
  }

  /** Guarda un objeto y devuelve su ID
   * @param {CustomObject} object
   * @returns {Promise<number>}
   */
  async save(productBody) {
    try {
      return await this.knex(this.table).insert(productBody)
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Devuelve un elemento en base a un ID
   * @param {number} id
   * @returns {Promise<CustomObject>}
   */
  async getById(id) {
    try {
      return this.knex.select('*').from(this.table).where('id', id)
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Retrona todos los elementos
   * @returns {Promise<CustomObject[]>}
   */
  async getAll() {
    try {
      return this.knex.select('*').from(this.table)
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Actualiza un elemento en base a un ID
   * @param {CustomObject} produ
   * @returns {Promise<number>}
   */
  async updateById(id, productBody) {
    try {
      return this.knex(this.table).where('id', id).update(productBody)
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Borra un elemento en base a su id
   * @param {number} id
   */
  async deleteById(id) {
    try {
      return this.knex.delete().from(this.table).where('id', id)
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Borra todos los elementos */
  async deleteAll() {
    try {
      return this.knex.delete().from(this.tabla)
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Realiza la desconección de la DB */
  async disconnect() {
    try {
      return this.knex.destroy()
    } catch (error) {
      throw new Error(`Error al desconectarse: ${error}`)
    }
  }
}

export default Contenedor
