import knex from 'knex'
import { mariadb, sqlite } from '../config/index.js'

export const createProductsTable = async () => {
  try {
    const knexInstance = knex(mariadb)

    const exists = await knexInstance.schema.hasTable('products')

    if (exists) {
      console.log("Skiping 'products' table creation")
      return await knexInstance.destroy()
    }

    await knexInstance.schema.createTable('products', (table) => {
      table.increments('id').primary()
      table.string('name').notNullable()
      table.string('description')
      table.string('code').notNullable()
      table.string('picture')
      table.integer('price').notNullable()
      table.integer('stock').notNullable()
      table.timestamp('timestamp').defaultTo(knexInstance.fn.now())
    })

    await knexInstance.destroy()
    console.log('Products table created')
  } catch (error) {
    console.log(error)
  }
}

export const createChatTable = async () => {
  try {
    const knexInstance = knex(sqlite)

    const exists = await knexInstance.schema.hasTable('chat')

    if (exists) {
      console.log("Skiping 'chat' table creation")
      return await knexInstance.destroy()
    }

    await knexInstance.schema.createTable('chat', (table) => {
      table.increments('id').primary()
      table.string('senderMail', 320).notNullable()
      table.string('message', 620).notNullable()
      table.timestamp('date').defaultTo(knexInstance.fn.now())
    })

    await knexInstance.destroy()
    console.log('Chat table created')
  } catch (error) {
    console.log(error)
  }
}
