// Inicializa las configuraciones del entorno
import dotenv from 'dotenv'
dotenv.config()

const adapter = process.env.DB_ADAPTER?.toLocaleLowerCase() || 'mongodb'

console.log(`🔌 Using ${adapter} adapter`)

const adapters = {
  mongodb: {
    ProductsDAO: await import('./products/products.mongo.dao.js'),
    CartsDAO: await import('./carts/carts.mongo.dao.js'),
    ChatDAO: await import('./chats/chats.mongo.dao.js')
  },
  firebase: {
    ProductsDAO: await import('./products/products.firebase.dao.js'),
    CartsDAO: await import('./carts/carts.firebase.dao.js'),
    ChatDAO: await import('./chats/chats.firebase.dao.js')
  },
  memory: {
    ProductsDAO: await import('./products/products.memory.dao.js'),
    CartsDAO: await import('./carts/carts.memory.dao.js'),
    ChatDAO: await import('./chats/chats.memory.dao.js')
  },
  file: {
    ProductsDAO: await import('./products/products.file.dao.js'),
    CartsDAO: await import('./carts/carts.file.dao.js'),
    ChatDAO: await import('./chats/chats.file.dao.js')
  }
}

export const ProductsDAO = adapters[adapter].ProductsDAO.ProductsDAO
export const CartsDAO = adapters[adapter].CartsDAO.ProductsDAO
export const ChatsDAO = adapters[adapter].ChatDAO.ChatsDAO
