import { options } from './config/mariaDB.js'
import _knex from 'knex'

export const knex = _knex(options)
