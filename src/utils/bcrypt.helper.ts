import bcrypt from 'bcrypt'

export function hashPassword (password: string): string {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  return hash
}

export function comparePassword (password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}
