import { DataSource, Repository } from 'typeorm';
import { IUserEntity } from '../interfaces/entity-interfaces';
import { UserEntity } from '../entities/app.entity';
import { IUserRepository } from '../interfaces/repository-interfaces';
import { IUserDTO } from '../interfaces/dto';

export class UserRepository implements IUserRepository {
  private readonly repository: Repository<IUserEntity>;
  
  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository<IUserEntity>(UserEntity);
  }
  
  async findAll(): Promise<IUserEntity[]> {
    return await this.repository.find();
  }
  
  async findById(id: number): Promise<IUserEntity | null> {
    return await this.repository.findOne({ where : { id }});
  }
  
  async create(user: IUserDTO): Promise<IUserEntity> {
    return await this.repository.save(user);
  }
  
  async update(id: number, user: IUserDTO): Promise<IUserEntity | null> {
    return (await this.repository.update(id, user)).raw();
  }
  
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}