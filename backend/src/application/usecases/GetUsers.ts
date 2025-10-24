import { User } from '../../domain/entities/User';
import { UserService } from '../../domain/services/UserService';

export class GetUsersUseCase {
  constructor(private userService: UserService) {}

  async execute(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }
}