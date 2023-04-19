import { Document } from 'mongoose'
import UserModel from './models/user.model'

export interface User {
  name: string
  address: string
  age: number
  phone: string
  email: string
  password: string
  role?: string
  avatar?: string
}

export type UserDocument = User & Document

export default class UserDAO {
  public async create (user: User) {
    const newUser = new UserModel(user)
    return await newUser.save()
  }

  public async findByEmail (email: string) {
    return await UserModel.findOne({ email })
  }

  public async findById (id: string) {
    return await UserModel.findById(id)
  }
}
