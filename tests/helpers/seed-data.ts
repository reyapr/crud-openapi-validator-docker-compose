import { DataSource } from 'typeorm'

export const seedUserData = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository('user')
  const user1 = {
    name: 'bambang',
    email: 'bambang@dunia.com',
    role: 'admin',
    password: 'pass123'
  }

  const user2 = {
    name: 'udin',
    email: 'udin@sedunia.com',
    role: 'admin',
    password: 'pass123'
  }

  const deletedUser = {
    name: 'deleted',
    email: 'email@email.com',
    role: 'admin',
    password: 'pass123',
    deleted_at: new Date()
  }

  await userRepository.save([user1, user2, deletedUser])
}
