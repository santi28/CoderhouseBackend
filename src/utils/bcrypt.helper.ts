import bcrypt from 'bcrypt'

// Retorna un hash en base a un password
export function hashPassword (password: string): string {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  return hash
}

// Compara un password en texto plano con un hash
export function comparePassword (password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}
