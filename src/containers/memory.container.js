class Contenedor {
  objects = []

  /** @param {string} filename */
  constructor() {}

  /** Guarda un objeto y devuelve su ID
   * @param {CustomObject} object
   * @returns {Promise<number>}
   */
  async save(object) {
    const objects = await this.getAll()

    const id = (objects[objects.length - 1]?.id ?? 0) + 1

    const objectToSave = { id, ...object }
    this.objects = [...objects, objectToSave]
  }

  /** Devuelve un elemento en base a un ID
   * @param {number} id
   * @returns {Promise<CustomObject>}
   */
  async getById(id) {
    const objects = await this.getAll()
    return objects.find((object) => object.id === id)
  }

  /** Retrona todos los elementos
   * @returns {Promise<CustomObject[]>}
   */
  async getAll() {
    return this.objects
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

      const products = await this.getAll()

      const productToUpdate = Object.fromEntries(
        Object.entries(gettedProduct).filter(
          ([_, value]) => value !== undefined
        )
      )

      const updatedProduct = { ...product, ...productToUpdate }

      this.objects = this.objects.map((product) => {
        if (product.id === id) return updatedProduct
        return product
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /** Borra un elemento en base a su id
   * @param {number} id
   */
  async deleteById(id) {
    const objects = await this.getAll()
    this.objects = objects.filter((object) => object.id !== id)
  }

  /** Borra todos los elementos */
  async deleteAll() {
    this.objects = []
  }
}

export default Contenedor
