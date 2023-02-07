import { schema } from 'normalizr'

export const authorSchema = new schema.Entity(
  'authors',
  {},
  { idAttribute: 'id' }
)
export const messageSchema = new schema.Entity(
  'messages',
  { author: authorSchema },
  { idAttribute: '_id' }
)
