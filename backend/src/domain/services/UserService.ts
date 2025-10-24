import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(user: User): Promise<User> {
    if (!user.nombre || !user.apellido || !user.email) {
      throw new Error('Todos los campos son requeridos');
    }
    return await this.userRepository.create(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}