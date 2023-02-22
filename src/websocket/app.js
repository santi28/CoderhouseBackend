import { normalize } from 'normalizr'
import { Server as SocketIOServer } from 'socket.io'

import { ChatsDAO } from '../daos/chats/chats.mongo.dao.js'
import { ProductsDAO } from '../daos/products/products.mongo.dao.js'

import { messageSchema } from '../schemas/messages.schema.js'

const chatContainer = new ChatsDAO()
const productsContainer = new ProductsDAO()

export const initWebscoketServer = (server) => {
  const io = new SocketIOServer(server)

  io.on('connection', async (socket) => {
    console.log('👨‍🚀 New client connected')

    const productos = await productsContainer.getAll()
    socket.emit('productos', productos)

    const messages = await chatContainer.getAll()
    const normalizedMessages = normalize(messages, [messageSchema])

    socket.emit('messages', normalizedMessages)

    socket.on('new-product', async (data) => {
      try {
        const productCode = `${data.name
          .split(' ')
          .map((word) => word[0])
          .join('')
          .toUpperCase()}${Math.floor(Math.random() * 10000)}`

        const productPayload = {
          name: data.name,
          price: data.price,
          picture: data.picture,
          description: data.name,
          code: productCode,
          stock: 10
        }

        const savedProduct = await productsContainer.save(productPayload)

        io.sockets.emit('update-products', savedProduct)
      } catch (error) {
        console.error(error)
      }
    })

    socket.on('new-message', async (messagePayload) => {
      const message = await chatContainer.save(messagePayload)
      // const chatMessage = await chatContainer.getById(messageId)
      io.sockets.emit('update-messages', message)
    })

    socket.on('disconnect', () => console.log('🚀 Client disconnected'))
  })
}
