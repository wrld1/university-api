import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ResetTokenModule } from '../reset-token/reset-token.module';
import { jwtConstants } from '../application/constants/auth.constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ResetTokenModule,
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
