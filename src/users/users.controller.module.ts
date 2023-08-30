import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersControllerService } from './users.controller.service';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersControllerService],
})
export class UsersControllerModule {}
