import { UserController } from './controller/user-controller'
import { dataSource } from './datasource'
import { UserRepository } from './repositories/user-repository'
import { UserService } from './services/user-service'

export const init = async () => {
  const ds = await dataSource.initialize()

  const userRepository = new UserRepository(ds)

  const userService = new UserService(userRepository)

  const userController = new UserController(userService)

  return {
    userController
  }
}
