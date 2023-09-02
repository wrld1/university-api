import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResetTokenService } from '../reset-token/reset-token.service';
import { SignResponseDto } from './dto/sign.response.dto';
import { ResetTokenInterface } from '../reset-token/interfaces/reset-token.interface';
import { ResetPasswordWithTokenRequestDto } from './dto/reset-password-with-token.request.dto';
import { LectorsService } from 'src/lectors/lectors.service';

@Injectable()
export class AuthService {
  constructor(
    private lectorsService: LectorsService,
    private jwtService: JwtService,
    private resetTokenService: ResetTokenService,
  ) {}

  public async signUp(email: string, pass: string): Promise<SignResponseDto> {
    const lector = await this.lectorsService.createLector({
      email: email,
      password: pass,
    });
    const payload = { sub: lector.id, email: lector.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async resetPasswordRequest(
    email: string,
  ): Promise<ResetTokenInterface> {
    const lector = await this.lectorsService.getLectorByEmail(email);
    if (!lector) {
      throw new BadRequestException(
        `Cannot generate token for reset password request  because lector ${email} is not found`,
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
    const lector = await this.lectorsService.getLectorByEmail(email);
    if (!lector) {
      throw new BadRequestException(`User is not found`);
    }
    if (lector.password !== oldPassword) {
      throw new BadRequestException(`Old password is incorrect`);
    }
    await this.lectorsService.updateLectorById(lector.id, {
      password: newPassword,
    });
    await this.resetTokenService.removeResetToken(token);
  }

  public async signIn(email: string, pass: string): Promise<SignResponseDto> {
    const lector = await this.lectorsService.getLectorByEmail(email);
    if (lector?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { lectorId: lector.id, email: lector.email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
