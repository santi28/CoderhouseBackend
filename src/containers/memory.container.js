// TODO: Migrar funcionalidad a typescript
class Contenedor {
  constructor () {
    this.objects = []
  }

  async save (object) {
    const objects = await this.getAll()

    const id = (objects[objects.length - 1]?.id ?? 0) + 1

    const objectToSave = { id, ...object }
    this.objects = [...objects, objectToSave]
  }

  async getById (id) {
    const objects = await this.getAll()
    return objects.find((object) => object.id === id)
  }

  async getAll () {
    return this.objects
  }

  async updateById (id, gettedProduct) {
    try {
      const product = await this.getById(id)
      if (!product) throw new Error('Producto no encontrado')

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

  async deleteById (id) {
    const objects = await this.getAll()
    this.objects = objects.filter((object) => object.id !== id)
  }

  async deleteAll () {
    this.objects = []
  }
}

export default Contenedor
