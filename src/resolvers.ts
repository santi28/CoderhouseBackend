import UserDAO from './dao/mongo/user.dao'
const userDAO = new UserDAO()

export default {
  Query: {
    hello: () => 'Hello world!',
    getUsers: async () => {
      const users = await userDAO.findAll()
      return users
    }
  }
}
