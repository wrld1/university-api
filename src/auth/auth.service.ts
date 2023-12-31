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
import { comparePasswords } from 'src/security/password.comparer';
import { MailService } from 'src/mail/mail.service';
import { hashPassword } from 'src/security/password.hasher';

@Injectable()
export class AuthService {
  constructor(
    private lectorsService: LectorsService,
    private jwtService: JwtService,
    private resetTokenService: ResetTokenService,
    private mailService: MailService,
  ) {}

  public async signUp(email: string, pass: string): Promise<SignResponseDto> {
    await this.lectorsService.createLector({
      email: email,
      password: pass,
    });
    const payload = { sub: email };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async signIn(
    userEmail: string,
    pass: string,
  ): Promise<SignResponseDto> {
    const { id, email, password } =
      await this.lectorsService.getLectorByEmail(userEmail);

    const passwordMatch = await comparePasswords(pass, password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { id, email };
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
        `Cannot generate token for reset password request because lector ${email} is not found`,
      );
    }

    const resetToken = await this.resetTokenService.generateResetToken(email);

    const resetLink = `${process.env.RESET_LINK}?token=${resetToken.token}&id=${lector.id}`;

    await this.mailService.sendResetLink(email, resetLink);

    return resetToken;
  }

  public async resetPassword(
    resetPasswordWithTokenRequestDto: ResetPasswordWithTokenRequestDto,
    token: string,
    lectorId: string,
  ): Promise<void> {
    const { email, oldPassword, newPassword } =
      resetPasswordWithTokenRequestDto;
    const resetPasswordRequest =
      await this.resetTokenService.getResetToken(token);
    if (!resetPasswordRequest) {
      throw new BadRequestException(
        `There is no reset password request for lector: ${email}`,
      );
    }
    const lector = await this.lectorsService.getLectorById(lectorId);
    if (!lector) {
      throw new BadRequestException(`Lector is not found`);
    }

    const isPasswordValid = await comparePasswords(
      oldPassword,
      lector.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException(`Old password is incorrect`);
    }

    const hashedNewPassword = await hashPassword(newPassword);

    await this.lectorsService.updateLectorById(lector.id, {
      password: hashedNewPassword,
    });

    await this.resetTokenService.removeResetToken(token);
  }
}
