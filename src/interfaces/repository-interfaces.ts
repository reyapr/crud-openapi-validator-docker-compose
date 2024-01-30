import { IUserDTO } from "./dto";
import { IUserEntity } from "./entity-interfaces";

export interface IUserRepository {
  findAll(): Promise<IUserEntity[]>;
  findById(id: number): Promise<IUserEntity | null>;
  create(user: IUserDTO): Promise<IUserEntity>;
  update(id: number, user: IUserDTO): Promise<IUserEntity | null>;
  delete(id: number): Promise<void>;
}