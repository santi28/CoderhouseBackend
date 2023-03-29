import path from 'path'
import Container from '../../containers/file.container.js'

export class ChatsDAO extends Container {
  constructor () {
    super(path.join('src/db/chats.json'))
  }
}
