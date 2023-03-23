import bcrypt from 'bcrypt'

const BCryptHelper = {
  isValidPassword: (password, hash) => {
    console.log('password', password)
    console.log('hash', hash)
    return bcrypt.compareSync(password, hash)
  },
  hashPassword: (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
  }
}

export default BCryptHelper
