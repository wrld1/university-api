import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResetTokenService } from '../reset-token/reset-token.service';
import { SignResponseDto } from './dto/sign.response.dto';
import { ResetTokenInterface } from '../reset-token/interfaces/reset-token.interface';
import { ResetPasswordWithTokenRequestDto } from './dto/reset-password-with-token.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private resetTokenService: ResetTokenService,
  ) {}

  public async signUp(email: string, pass: string): Promise<SignResponseDto> {
    const user = await this.usersService.create(email, pass);
    const payload = { sub: user.userId, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async resetPasswordRequest(
    email: string,
  ): Promise<ResetTokenInterface> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException(
        `Cannot generate token for reset password request  because user ${email} is not found`,
      );
    }
    return await this.resetTokenService.generateResetToken(email);
  }

  public async resetPassword(
    resetPasswordWithTokenRequestDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    const { token, email, oldPassword, newPassword } =
      resetPasswordWithTokenRequestDto;
    const resetPasswordRequest = await this.resetTokenService.getResetToken(
      token,
    );
    if (!resetPasswordRequest) {
      throw new BadRequestException(
        `There is no request password request for user: ${email}`,
      );
    }
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException(`User is not found`);
    }
    if (user.password !== oldPassword) {
      throw new BadRequestException(`Old password is incorrect`);
    }
    await this.usersService.update(user.userId, { password: newPassword });
    await this.resetTokenService.removeResetToken(token);
  }

  public async signIn(email: string, pass: string): Promise<SignResponseDto> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.userId, email: user.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
