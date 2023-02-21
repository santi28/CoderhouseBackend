import bcrypt from 'bcrypt'

const BCryptHelper = {
  isValidPassword: (password, hash) => {
    return bcrypt.compareSync(password, hash)
  },
  hashPassword: (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  }
}

export default BCryptHelper
