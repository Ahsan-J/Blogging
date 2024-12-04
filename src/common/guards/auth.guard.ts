import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenService } from '@/shared/token/token.service';
import { UserRole } from '@/modules/user/user.enum';
import { BitwiseOperator } from '@/common/utils/bitwise.utility';
import { UserRepository } from '@/modules/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private userRepository: UserRepository,
        private reflector: Reflector
    ) { }

    private readonly bitwiseOperator = new BitwiseOperator<UserRole>();

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [context.getHandler(), context.getClass()]) || [];
        const request: Request = context.switchToHttp().getRequest();

        const headerData: Request['headers'] = {
            ...request.headers,
            'x-api-key': (request.headers['x-api-key'] || request.query['key']) as string,
            'authorization': (request.headers['authorization'] || request.query['token']) as string,
        }

        if (!headerData.authorization) throw new UnauthorizedException("Authorization token is missing");
        
        const [userId, userRole] = this.tokenService.getTokenData(headerData.authorization);

        // Check if user role matches any of the required roles using bitwise operator
        if (requiredRoles.length && !requiredRoles.some(role => this.bitwiseOperator.hasValue(parseInt(userRole, 10), role))) {
            throw new ForbiddenException("User does not have the required roles");
        }
        
        request.user = await this.getUser(userId);

        return true;

    }

    private async getUser(userId: string) {
        try {
            return await this.userRepository.findUserById(userId)
        } catch (err) {
            throw new UnauthorizedException(err);
        }
    }
}