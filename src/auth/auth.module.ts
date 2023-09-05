import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ResetTokenModule } from '../reset-token/reset-token.module';
import { jwtConstants } from '../application/constants/auth.constants';
import { LectorsModule } from 'src/lectors/lectors.module';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    LectorsModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ResetTokenModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    AuthGuard,
    MailService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
