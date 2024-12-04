import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotAcceptableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "@/modules/user/user.entity";
import { TokenService } from "@/shared/token/token.service";
import { LoginResponse } from "./dto/login.dto";
import { UserRepository } from "@/modules/user/user.repository";
import { Crypto } from "@/common/utils/encryption.utility";
import { RegisterUserRequest } from "./dto/register.dto";
import { ResetPasswordRequest } from './dto/reset.dto';
import { MailService } from "@/shared/mail/mail.service";
import { UserResponse } from "@/modules/user/dto/user-response.dto";

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private tokenService: TokenService,
        private mailService: MailService,
        private userRepository: UserRepository,
    ) { }

    get cryptoHelper(): Crypto { return new Crypto(this.configService.get("APP_ID") || "") }

    private resetKeyword = "RESET_PASSWORD"
    private activationKeyword = "ACTIVATION_KEYWORD"

    logger = new Logger(AuthService.name)

    async authenticateUser(email: string, password: string): Promise<LoginResponse> {
        const userInfo: User = await this.userRepository.findUserByEmail(email);

        if (!userInfo.isActive) {
            throw new ForbiddenException("Your account is not active at the moment. Check your email and follow steps to activate")
        }
      
        if (userInfo.isBlocked) {
            throw new ForbiddenException("Your Account has been temporarily blocked");
        }
    
        const loginPassword: string = this.cryptoHelper.getTextHash(password);
        
        if (userInfo.password !== loginPassword) {
            throw new BadRequestException("Password mismatch")
        }
      
        const access_token = await this.tokenService.generateToken([ userInfo.id, userInfo.role ]);
    
        return new LoginResponse(userInfo, access_token);
    }

    async registerUser(registerUser: RegisterUserRequest, profile: Express.Multer.File): Promise<UserResponse> {
        
        if(registerUser.confirm_password !== registerUser.password) {
            throw new NotAcceptableException("Password mismatch")
        }

        const savedUser: User = await this.userRepository.findUserByEmail(registerUser.email);
    
        if(savedUser) {
          throw new ConflictException("User Already registered with email")
        }
        
        const user = await this.userRepository.create({
          password: this.cryptoHelper.getTextHash(registerUser.password),
          email: registerUser.email,
          name: registerUser.name,
          profile: `/profile/${profile?.filename}`,
          bio: registerUser.bio,
          linkedin: registerUser.linkedin,
          github: registerUser.github,
          website: registerUser.github
        });

        user.isActive = false

        const newUser = await this.userRepository.save(user);

        const activationCode = await this.tokenService.generateToken([ this.activationKeyword, newUser.id, newUser.role ]);

        this.sendActivationCode(newUser.email, activationCode)
    
        return new UserResponse(newUser);
    }

    async validateActivationCode(code: string): Promise<LoginResponse> {
        const [activationKeyword, userId] = this.tokenService.getTokenData(code);

        if(activationKeyword != this.activationKeyword) {
            throw new BadRequestException("Invalid Activation code")
        }

        const user = await this.userRepository.findUserById(userId);
        
        user.isActive = true
        user.isBlocked = false;

        const savedUser = await this.userRepository.save(user)
    
        const access_token = await this.tokenService.generateToken([ savedUser.id, savedUser.role ]);
    
        return new LoginResponse(savedUser, access_token);
    }

    async resetPassword(resetPassword: ResetPasswordRequest): Promise<string> {

        const [keyword, userId] = this.tokenService.getTokenData(resetPassword.code);

        const user = await this.userRepository.findUserByEmail(resetPassword.email);

        if(keyword != this.resetKeyword || userId !== user.id) {
            throw new BadRequestException("Invalid Reset for matching User")
        }
    
        if (resetPassword.confirm_password !== resetPassword.password) {
          throw new BadRequestException("User Password mismatch")
        }
    
        return "Password Reset Successful. Try logging with new Password";
    }

    async generateResetPasswordToken(email: string): Promise<string> {
        const user = await this.userRepository.findUserByEmail(email);
        return this.tokenService.generateToken([ this.resetKeyword, user.id, user.role ]);
    }

    async forgotPassword(email: string): Promise<string> {
        const resetCode = await this.generateResetPasswordToken(email)

        this.sendResetCode(email, resetCode)

        return "The code has been sent to your email address. Kindly verify the code for further processing";
    }

    private async sendActivationCode(email: string, activationCode: string) {
        this.logger.log(email, activationCode)
    }

    private async sendResetCode(email: string, resetCode: string) {
        this.logger.log(email, resetCode)
    }
}