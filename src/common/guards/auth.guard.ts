import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenService } from '@/shared/token/token.service';
import { UserRole } from '@/modules/user/user.enum';
import { BitwiseOperator } from '@/common/utils/bitwise.utility';
import { UserRepository } from '@/modules/user/user.repository';

export const UseRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

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
        const request = context.switchToHttp().getRequest();

        const headerData: Request['headers'] = {
            ...request.headers,
            'x-api-key': (request.headers['x-api-key'] || request.query['key']) as string,
            'authorization': (request.headers['authorization'] || request.query['token']) as string,
        }

        if (headerData.authorization) {
            const [userId, userRole] = this.tokenService.getTokenData(headerData.authorization);
            if (requiredRoles.length && !requiredRoles.some(role => this.bitwiseOperator.hasValue(parseInt(userRole, 10), role))) return false;

            request.user = await this.userRepository.findUserById(userId)

            return true;
        }

        return false
    }
}