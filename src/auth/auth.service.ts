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

  public async signUp(
    username: string,
    pass: string,
  ): Promise<SignResponseDto> {
    const user = await this.usersService.create(username, pass);
    const payload = { sub: user.userId, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async resetPasswordRequest(
    username: string,
  ): Promise<ResetTokenInterface> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new BadRequestException(
        `Cannot generate token for reset password request  because user ${username} is not found`,
      );
    }
    return await this.resetTokenService.generateResetToken(username);
  }

  public async resetPassword(
    resetPasswordWithTokenRequestDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    const { token, username, oldPassword, newPassword } =
      resetPasswordWithTokenRequestDto;
    const resetPasswordRequest = await this.resetTokenService.getResetToken(
      token,
    );
    if (!resetPasswordRequest) {
      throw new BadRequestException(
        `There is no request password request for user: ${username}`,
      );
    }
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new BadRequestException(`User is not found`);
    }
    if (user.password !== oldPassword) {
      throw new BadRequestException(`Old password is incorrect`);
    }
    await this.usersService.update(user.userId, { password: newPassword });
    await this.resetTokenService.removeResetToken(token);
  }

  public async signIn(
    username: string,
    pass: string,
  ): Promise<SignResponseDto> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.userId, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
