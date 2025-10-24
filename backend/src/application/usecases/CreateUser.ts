import { User } from '../../domain/entities/User';
import { UserService } from '../../domain/services/UserService';

export class CreateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(userData: User): Promise<User> {
    return await this.userService.createUser(userData);
  }
}