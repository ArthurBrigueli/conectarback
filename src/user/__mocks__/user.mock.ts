import { User } from "../user.entity"

export const userMock: User = {
    id: 1,
    name: 'Arthur',
    email: 'arthur@gmail.com',
    password: 'arthur123',
    role: 'admin',
    createdAt: new Date(),
    lastLogin: new Date(),
    updatedAt: new Date()
}