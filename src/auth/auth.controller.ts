import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Query,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignRequestDto } from './dto/sign.request.dto';
import { SignResponseDto } from './dto/sign.response.dto';
import { ResetPasswordRequestDto } from './dto/reset-password.request.dto';
import { ResetPasswordWithTokenRequestDto } from './dto/reset-password-with-token.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordResponseDto } from './dto/reset-password.response.dto';
import { Public } from './decorators/public.route.decorator';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('is-authenticated')
  @UseGuards(AuthGuard)
  isAuthenticated() {
    return { authenticated: true };
  }

  @ApiOperation({ summary: 'Sign in' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SignResponseDto,
    description: 'Access token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized exception',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  public signIn(@Body() signInDto: SignRequestDto): Promise<SignResponseDto> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: 'Sign up' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: SignResponseDto,
    description: 'Access token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-up')
  public signUp(@Body() signUpDto: SignRequestDto): Promise<SignResponseDto> {
    return this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  @ApiOperation({ summary: 'Reset password request' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: ResetPasswordResponseDto,
    description: 'Reset token',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('reset-password-request')
  public resetPasswordRequest(
    @Body() resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    return this.authService.resetPasswordRequest(resetPasswordDto.email);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    description: 'Reset password',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  @Post('reset-password')
  public resetPassword(
    @Query('token') token: string,
    @Query('id') lectorId: string,
    @Body() resetPasswordDto: ResetPasswordWithTokenRequestDto,
  ): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto, token, lectorId);
  }
}
