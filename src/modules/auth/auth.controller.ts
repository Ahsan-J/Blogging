import { Controller, Post, Body, ForbiddenException, BadRequestException, Headers, Get, Query, Inject, Session, Res, UseGuards } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UsersService } from '../user/user.service';
import { ForgotPasswordBody, LoginBody, RegisterBody, ResetPasswordBody, ActivateUserBody } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '../../helper-modules/mail/mail.service';
import { UserStatus } from '../user/user.enum';
import { CommonService } from 'src/helper-modules/common/common.service';
import { Response, Request } from "express";
import { TokenService } from 'src/helper-modules/token/token.service';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private mailService: MailService,
    @Inject(CommonService)
    private commonService: CommonService,
    @Inject(TokenService)
    private tokenService: TokenService,
  ) { }

  @Post('login')
  async loginUser(@Body() body: LoginBody, @Headers() headers: Request['headers'], @Session() session: Record<string, any>): Promise<User & { access_token: string, token_expiry: number }> {

    const userInfo: User = await this.userService.getUserByEmail(body.email);

    if (this.commonService.checkValue(userInfo.status, UserStatus.InActive)) {
      throw new ForbiddenException("Your account is not active at the moment. Check your email and follow steps to activate")
    }

    if (this.commonService.checkValue(userInfo.status, UserStatus.Blocked)) {
      throw new ForbiddenException("Your Account has been temporarily blocked");
    }

    const loginPassword: string = this.userService.getPasswordHash(body.password);

    if (userInfo.password !== loginPassword) {
      throw new BadRequestException("Password mismatch")
    }

    delete userInfo.password;

    // setting value for @AuthUser in auth.decorator.ts
    session.user = userInfo;

    const access_token = await this.tokenService.generateToken(userInfo, headers);

    return {
      ...userInfo,
      access_token,
      token_expiry: 86400
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logoutUser(@Headers() headers: Request['headers'], @Session() session: Record<string, any>): Promise<string> {
    delete session.user;
    return await this.tokenService.removeToken(headers);
  }

  @Post('register')
  async registerUser(@Body() body: RegisterBody, @Headers() headers: Request['headers'], @Session() session: Record<string, any>): Promise<User & { access_token: string, token_expiry: number }> {

    const userInfo = await this.userService.createUser(body);

    const markup = await this.authService.generateActivationMarkup(userInfo)

    // await this.mailService.sendEmailTemplate(userInfo.email, "Activate Your Account", markup)

    const access_token = await this.tokenService.generateToken(userInfo, headers);

    session.user = userInfo;

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
    user.status = this.commonService.setValue(user.status, UserStatus.Active);
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

}
