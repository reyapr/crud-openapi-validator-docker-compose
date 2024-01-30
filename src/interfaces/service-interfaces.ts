import { IUserDTO } from "./dto";

export interface IUserService {
  findAll(): Promise<IUserDTO[]>;
  findById(id: number): Promise<IUserDTO | null>;
  create(user: IUserDTO): Promise<IUserDTO>;
  update(id: number, user: IUserDTO): Promise<IUserDTO | null>;
  softDelete(id: number): Promise<void>;
}