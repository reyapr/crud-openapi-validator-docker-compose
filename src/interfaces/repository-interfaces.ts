import { IUserEntity } from "./entity-interfaces";

export interface IUserRepository {
  findAll(): Promise<IUserEntity[]>;
  findById(id: number): Promise<IUserEntity | null>;
  create(user: IUserEntity): Promise<IUserEntity>;
  update(id: number, user: IUserEntity): Promise<IUserEntity | null>;
  delete(id: number): Promise<void>;
}