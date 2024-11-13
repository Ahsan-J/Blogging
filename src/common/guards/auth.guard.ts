import { Injectable, CanActivate, ExecutionContext, Inject, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenService } from '@/shared/token/token.service';
import { UserRole } from '../../modules/user/user.enum';
import { BitwiseOperator } from '../utils/bitwise.utility';

export const UseRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(TokenService) 
        private tokenService: TokenService, 
        private reflector: Reflector
    ) { }

    private readonly bitwiseOperator = new BitwiseOperator(UserRole);

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [context.getHandler(), context.getClass()]) || [];
        const request = context.switchToHttp().getRequest();
        
        const headerData: Request['headers'] = {
            ...request.headers,
            'x-api-key': (request.headers['x-api-key'] || request.query['key']) as string,
            'authorization': (request.headers['authorization'] || request.query['token']) as string,
        }
        if(await this.tokenService.validateAccessToken(headerData)) {
            const { /* userId, */ userRole } = this.tokenService.getTokenData(headerData);
            if(requiredRoles.length && !requiredRoles.some(role => this.bitwiseOperator.hasValue(userRole, role))) return false;

            // case where session user doesn't match token user. 
            // @Todo: Force log out user before checking it.
            // if(request.session.user?.id != userId) return false;
            
            return true; 
        }
        
        return false
    }
}