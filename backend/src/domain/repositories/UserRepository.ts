import { User } from '../entities/User';

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}