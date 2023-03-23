import Container from '../../containers/mongo.container.js'
import Chat from '../../models/chat.model.js'

export class ChatsDAO extends Container {
  constructor() {
    super(Chat)
  }
}
