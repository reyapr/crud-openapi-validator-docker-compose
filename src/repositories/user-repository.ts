import { DataSource, IsNull, Repository } from 'typeorm'
import { IUserEntity } from '../interfaces/entity-interfaces'
import { UserEntity } from '../entities/user.entity'
import { IUserRepository } from '../interfaces/repository-interfaces'
import { IUserDTO } from '../interfaces/dto'

export class UserRepository implements IUserRepository {
  private readonly repository: Repository<IUserEntity>

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository<IUserEntity>(UserEntity)
  }

  async findAll(): Promise<IUserEntity[]> {
    return await this.repository.find({ where: { deleted_at: IsNull() } })
  }

  async findById(id: string): Promise<IUserEntity | null> {
    return await this.repository.findOne({
      where: { id, deleted_at: IsNull() }
    })
  }

  async create(user: IUserDTO): Promise<IUserEntity> {
    return await this.repository.save(user)
  }

  async update(id: string, user: IUserDTO): Promise<number> {
    return (await this.repository.update(id, user)).affected || 0
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
