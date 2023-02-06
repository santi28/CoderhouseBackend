
class Contenedor {
  constructor(model) {
    /** @type {Model} */
    this.model = model
  }
  async getById(id) {
    try {
      return await this.model.findById(id)
    } catch (error) {
      throw new Error(error)
    }
  }

  async getAll() {
    try {
      return await this.model.find()
    } catch (error) {
      throw new Error(error)
    }
  }

  async save(item) {
    try {
      const newItem = new this.model(item)
      await newItem.save()

      return newItem
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Actualiza un elemento en base a un ID
   * @param {CustomObject} produ
   * @returns {Promise<number>}
   */
  async updateById(id, item) {
    try {
      return await this.model.findByIdAndUpdate(id, item);
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Borra un elemento en base a su id
   * @param {number} id
   */
  async deleteById(id) {
    try {
      return await this.model.findByIdAndDelete(id)
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Borra todos los elementos */
  async deleteAll() {
    try {
      return await this.model.deleteMany()
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default Contenedor