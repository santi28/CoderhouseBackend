import Container from '../../containers/mongo.container.js'
import Users from '../../models/user.model.js'

export class UsersDAO extends Container {
  constructor() {
    super(Users)
  }

  async getById(id) {
    return await Users.findById(id)
  }

  async getByEmail(email) {
    return await Users.findOne({ email })
  }

  async register(user) {
    const newUser = new Users(user)
    return await newUser.save()
  }

  /** @deprecated */
  async login(email, password) {
    return await Users.findOne({ email, password })
  }
}
