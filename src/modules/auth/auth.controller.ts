import { Controller, Post, Body, ForbiddenException, BadRequestException, Headers, Get, Query, Inject, Session, Res, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UsersService } from '../user/user.service';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { RegisterUserRequest } from './dto/register.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '@/shared/mail/mail.service';
import { Response, Request } from "express";
import { TokenService } from '@/shared/token/token.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { getStorage } from 'src/common/utils/utility';
import { ResetPasswordBody } from './dto/reset.dto';
import { ForgotPasswordBody } from './dto/forgot.dto';
import { ActivateUserBody } from './dto/activation.dto';
import { CheckAvailability } from './dto/availability.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private mailService: MailService,
    @Inject(TokenService)
    private tokenService: TokenService,
  ) { }

  @Post('login')
  async loginUser(@Body() body: LoginRequest, @Headers() headers: Request['headers']): Promise<LoginResponse> {

    const userInfo: User = await this.userService.getUserByEmail(body.email);

    if (!userInfo.isActive) {
      throw new ForbiddenException("Your account is not active at the moment. Check your email and follow steps to activate")
    }

    if (userInfo.isBlocked) {
      throw new ForbiddenException("Your Account has been temporarily blocked");
    }

    const loginPassword: string = this.userService.getPasswordHash(body.password);
    
    if (userInfo.password !== loginPassword) {
      throw new BadRequestException("Password mismatch")
    }

    delete userInfo.password;

    const access_token = await this.tokenService.generateToken(userInfo);

    return {
      ...userInfo,
      access_token,
      token_expiry: 86400
    }
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('profile', { storage: getStorage('profile') }))
  async registerUser(@Body() body: RegisterUserRequest, @UploadedFile() profile: Express.Multer.File): Promise<LoginResponse> {

    const userInfo = await this.userService.createUser(body, profile);
    
    // const markup = await this.authService.generateActivationMarkup(userInfo);
    // await this.mailService.sendEmailTemplate(userInfo.email, "Activate Your Account", markup);

    const access_token = await this.tokenService.generateToken(userInfo);

    return {
      ...userInfo,
      access_token,
      token_expiry: 86400
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordBody): Promise<string> {
    const userInfo = await this.userService.getUserByEmail(body.email);

    await this.authService.validateResetCode(userInfo, body.code);

    if (body.confirm_password !== body.password) {
      throw new BadRequestException("User Password mismatch")
    }

    if (body.password === userInfo.password) {
      throw new BadRequestException("User new password is matching the old password")
    }

    return "Password Reset Successful. Try logging with new Password";
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordBody): Promise<string> {
    const userInfo = await this.userService.getUserByEmail(body.email);

    const markup = await this.authService.generateResetMarkup(userInfo)

    // await this.mailService.sendEmailTemplate(userInfo.email, "Reset Your Account", markup)

    return "The code has been sent to your email address. Kindly verify the code for further processing"
  }

  @Get('activate')
  async activateUser(@Query() query: ActivateUserBody): Promise<User> {
    const user = await this.userService.getUser(query.id);
    await this.authService.validateActivationCode(user, query.code)
    user.isActive = true
    return user;
  }

  @Get('activation-template')
  async getActivationTemplate(@Query('id') id, @Res() res: Response) {
    const user = await this.userService.getUser(id)
    const code = await this.authService.generateActivationCode(user);
    res.setHeader("Content-Type", `text/html`);
    res.send(await this.authService.generateActivationMarkup(user, code))
  }

  @Get('reset-template')
  async getResetTemplate(@Query('id') id, @Res() res: Response) {
    const user = await this.userService.getUser(id)
    const code = await this.authService.generateResetCode(user);
    res.setHeader("Content-Type", `text/html`);
    res.send(await this.authService.generateResetMarkup(user, code))
  }

  @Post('check-availability')
  async checkAvailability(@Body() body: CheckAvailability) {
    try {
      const user = await this.userService.getUserByEmail(body.email);
      return !user;
    } catch(e) {
      return true;
    }
  }
}
