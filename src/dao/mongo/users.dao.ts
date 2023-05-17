import { Document } from 'mongoose'
import UserModel from './models/user.model'
import { hashPassword } from '../../utils/bcrypt.helper'

export interface User {
  name: string
  email: string
  password: string
  phone: string
  avatar?: string
  role?: string
  recoveryCode?: string
  status?: string
  deleted?: boolean
}

export type UserDocument = User & Document

export default class UsersDAO {
  public async create (user: User) {
    console.log('Creating user...')
    const hashedPassword = hashPassword(user.password)

    const newUser = new UserModel({
      ...user,
      password: hashedPassword
    })

    console.log('Saving user...')
    return await newUser.save()
  }

  public async findByEmail (email: string) {
    return await UserModel.findOne({ email })
  }

  public async findById (id: string) {
    return await UserModel.findById(id)
  }

  public async update (id: string, user: Partial<User>) {
    return await UserModel.findByIdAndUpdate(id, user)
  }
}
