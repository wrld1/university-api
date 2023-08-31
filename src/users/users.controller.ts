import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersControllerService } from './users.controller.service';

import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from './users.service';
import { CurrentUser } from 'src/auth/decorators/current.user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
@ApiBearerAuth('jwt')
export class UsersController {
  constructor(
    private readonly usersControllerService: UsersControllerService,
  ) {}

  @Get('me')
  public async findMe(@CurrentUser() loggedUser: User) {
    console.log(loggedUser);
    const response = await this.usersControllerService.findCurrentUser(
      loggedUser.userId,
    );
    console.log(response);
    return response;
  }
}
