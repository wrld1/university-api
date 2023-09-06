import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
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
    const payload = { sub: email, password: pass };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  public async signIn(email: string, pass: string): Promise<SignResponseDto> {
    const lector = await this.lectorsService.getLectorByEmail(email);

    const passwordMatch = await comparePasswords(pass, lector.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { lectorId: lector.id, email: lector.email };
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

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken.token}&id=${lector.id}`;

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
    // const isValid = await bcrypt.compare(token, resetPasswordRequest.token);

    // if (!isValid) {
    //   throw new Error('Invalid or expired password reset token');
    // }
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

    console.log(hashedNewPassword);

    await this.lectorsService.updateLectorById(lector.id, {
      password: hashedNewPassword,
    });

    await this.resetTokenService.removeResetToken(token);
  }
}
