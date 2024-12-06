import { Controller, Post, Body, Get, Query, UseInterceptors, UploadedFile, Render, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { RegisterUserRequest } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageGenerator } from '@/common/utils/storage.utility';
import { ResetPasswordRequest } from './dto/reset.dto';
import { ForgotPasswordRequest } from './dto/forgot.dto';
import { ActivateUserBody } from './dto/activation.dto';
import { UserResponse } from '@/modules/user/dto/user-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
  ) { }

  @Post('login')
  async loginUser(@Body() body: LoginRequest): Promise<LoginResponse> {
    return this.authService.authenticateUser(body.email, body.password)
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('profile', { storage: new StorageGenerator('profile').getStorage() }))
  async registerUser(
    @Body() body: RegisterUserRequest, 
    @UploadedFile() profile: Express.Multer.File
  ): Promise<UserResponse> {
    return this.authService.registerUser(body, profile);
  }

  @Get('reset-password')
  @Render('reset-password')
  @Version(VERSION_NEUTRAL)
  async resetPasswordTemplate(
    @Query('email') email: string,
  ) {
    const code = await this.authService.generateResetPasswordToken(email)
    return { code }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordRequest): Promise<string> {
    return this.authService.resetPassword(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordRequest): Promise<string> {
    return this.authService.forgotPassword(body.email); 
  }

  @Get('activate')
  @ApiQuery({ name: 'code', required: true, type: String, description: 'Activate code number for pagination' })
  async activateUser(@Query() query: ActivateUserBody): Promise<LoginResponse> {
    return this.authService.validateActivationCode(query.code);
  }

}
