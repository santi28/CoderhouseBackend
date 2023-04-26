import { expect } from 'chai'
import supertest from 'supertest'

import configurations from '../src/config/app.config'

const request = supertest(`http://localhost:${configurations.port}`)

// {
//   _id: '6425a8a55880bfcf6bdb4afb',
//   name: 'Macbook Air M2',
//   description: 'Macbook Air M2\r\n16gb RAM\r\n512gb SSD',
//   price: 780000,
//   image: 'http://localhost:8080/uploads/fe9282e2-dc9f-4c4c-9689-7c9149b023f8.jpg',
//   createdAt: '2023-03-30T15:20:05.182Z',
//   updatedAt: '2023-03-30T15:20:05.182Z',
//   __v: 0
// }

describe('Products integration test', () => {
  let productId: string

  it('should return all products', async () => {
    // Obtenemos todos los productos
    const response = await request.get('/api/products')

    // Verificamos que la respuesta sea 200
    expect(response.status).to.equal(200)

    // Verificamos que la respuesta sea un arreglo
    expect(response.body).to.be.an('array', 'The response must be an array')

    // Si el arreglo no tiene elementos, no hay nada que verificar
    if (response.body.length < 1) {
      return false
    }

    // Obtenemos el primer producto del arreglo
    const product = response.body[0]

    // Verificamos que el producto tenga los campos esperados
    expect(product).to.have.property('_id')
    expect(product).to.have.property('name')
    expect(product).to.have.property('description')
    expect(product).to.have.property('price')
    expect(product).to.have.property('image')

    // Guardamos la ID del producto para usarla en el siguiente test
    productId = product._id
  })

  it('should return a product by id', async () => {
    // Obtenemos un producto por id
    const response = await request.get(`/api/products/${productId}`)

    // Verificamos que la respuesta sea 200
    expect(response.status).to.equal(200)

    const product = response.body

    // Verificamos que la respuesta sea un objeto
    expect(product).to.be.an('object')

    // Verificamos que el producto tenga los campos esperados
    expect(product).to.have.property('_id')
    expect(product._id).to.equal(productId)
    expect(product).to.have.property('name')
    expect(product).to.have.property('description')
    expect(product).to.have.property('price')
    expect(product).to.have.property('image')
  })
})
