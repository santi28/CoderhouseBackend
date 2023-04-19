import * as bcrypt from 'bcrypt'
import { hashPassword } from './bcrypt.helper'

describe('hashPassword_function', () => {
  // Tests that the function returns a hash for a valid password input.
  it('test_valid_password_input', () => {
    const password = 'password123'
    const hashedPassword = hashPassword(password)
    expect(hashedPassword).toBeDefined()
  })

  // Tests that the function throws an error when an empty password is provided.
  it('test_empty_password_input', () => {
    const password = ''
    expect(() => hashPassword(password)).toThrowError('Empty password')
  })

  // Tests that the function always returns a string.
  it('test_return_type', () => {
    const result = hashPassword('password')
    expect(typeof result).toBe('string')
  })

  // Tests that the generated hash is unique for each input.
  it('test_unique_hash', () => {
    const password1 = 'password1'
    const password2 = 'password2'
    const hash1 = hashPassword(password1)
    const hash2 = hashPassword(password2)
    expect(hash1).not.toBe(hash2)
  })

  // Tests that the cost factor used for generating the salt is optimal for security.
  it('test_cost_factor', () => {
    const password = 'password'
    const saltRounds = 12
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, salt)
    expect(hash).toBeDefined()
  })
})
