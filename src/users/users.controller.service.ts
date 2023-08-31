import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UsersControllerService {
  constructor(private readonly usersService: UsersService) {}

  public async findCurrentUser(userId: number) {
    console.log('user.controller', userId);
    const user = await this.usersService.findById(userId);
    delete user.password;
    if (!user) {
      throw new NotFoundException(`User is not found`);
    }
    return user;
  }
}
