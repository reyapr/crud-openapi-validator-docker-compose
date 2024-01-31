import { ERROR_CODE } from '../config/error-code'
import { IUserDTO } from '../interfaces/dto'
import { IUserEntity } from '../interfaces/entity-interfaces'
import { IUserRepository } from '../interfaces/repository-interfaces'
import { IUserService } from '../interfaces/service-interfaces'
import { logger } from '../utils/logger'
import { StandardError } from '../utils/standard-error'
import bcrypt from 'bcrypt'

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async findAll(): Promise<IUserEntity[]> {
    return await this.userRepository.findAll()
  }

  async findById(id: string): Promise<IUserEntity> {
    const result = await this.userRepository.findById(id)

    if (!result) {
      throw new StandardError({
        error_code: ERROR_CODE.USER_NOT_FOUND,
        message: 'User not found'
      })
    }

    return result
  }

  async create(user: IUserDTO): Promise<IUserEntity> {
    try {
      logger.info('[IN_PROGGESS][UserService] create a new user', {
        request: user
      })

      const hashedPassword = await bcrypt.hash(user.password, 10)

      const result = await this.userRepository.create({
        ...user,
        password: hashedPassword
      })

      logger.info({ result, msg: '[SUCCESS][UserService] create a new user' })
      return result
    } catch (error) {
      logger.error('[FAILED][UserService] Failed to create a new user', {
        error
      })

      if ((error as Error).message.includes('violates unique constraint')) {
        throw new StandardError({
          error_code: ERROR_CODE.USER_ALREADY_EXISTS,
          message: 'User already exists'
        })
      }

      throw new StandardError({
        error_code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Failed to create a new user'
      })
    }
  }

  async update(id: string, user: IUserDTO): Promise<number> {
    try {
      logger.info('[IN_PROGGESS][UserService] update find a user by id', {
        request: { id, user }
      })
      const userExists = await this.userRepository.findById(id)
      if (!userExists) {
        throw new StandardError({
          error_code: ERROR_CODE.USER_NOT_FOUND,
          message: 'User not found'
        })
      }

      logger.info('[IN_PROGGESS][UserService] update a user', {
        request: { id, user }
      })
      const affected = await this.userRepository.update(id, user)

      logger.info({
        result: { affected },
        msg: '[SUCCESS][UserService] update a user'
      })
      return affected!
    } catch (error) {
      logger.error('[FAILED][UserService] Failed to update a user', { error })
      if (error instanceof StandardError) {
        throw error
      }
      throw new StandardError({
        error_code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Failed to update a user'
      })
    }
  }

  async softDelete(id: string): Promise<number> {
    try {
      logger.info('[IN_PROGGESS][UserService] soft delete find a user by id', {
        request: { id }
      })
      const userExists = await this.userRepository.findById(id)
      if (!userExists) {
        throw new StandardError({
          error_code: ERROR_CODE.USER_NOT_FOUND,
          message: 'User not found'
        })
      }

      const softDeleteUserExistReq: IUserDTO = {
        ...userExists,
        deleted_at: new Date()
      }

      logger.info('[IN_PROGGESS][UserService] soft delete a user', {
        request: { id, softDeleteUserExistReq }
      })

      const affected = await this.userRepository.update(
        id,
        softDeleteUserExistReq
      )

      logger.info('[SUCCESS][UserService] soft delete a user', {
        result: { affected }
      })
      return affected!
    } catch (error) {
      logger.error('[FAILED][UserService] Failed to soft delete a user', {
        error
      })
      if (error instanceof StandardError) {
        throw error
      }
      throw new StandardError({
        error_code: ERROR_CODE.INTERNAL_SERVER_ERROR,
        message: 'Failed to soft delete a user'
      })
    }
  }
}
