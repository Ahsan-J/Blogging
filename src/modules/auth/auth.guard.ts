import { Injectable, CanActivate, ExecutionContext, Inject, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CommonService } from 'src/helper-modules/common/common.service';
import { TokenService } from 'src/helper-modules/token/token.service';
import { UserRole } from '../user/user.enum';

export const UseRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(TokenService) 
        private tokenService: TokenService, 
        @Inject(CommonService)
        private commonService: CommonService,
        private reflector: Reflector
    ) { }

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
            if(requiredRoles.length && !requiredRoles.some(role => this.commonService.checkValue(userRole, role))) return false;

            // assigning user to session when undefined
            if(!request.session.user) {
                request.session.user = await this.tokenService.getTokenUser(headerData)
            }

            // case where session user doesn't match token user. 
            // @Todo: Force log out user before checking it.
            // if(request.session.user?.id != userId) return false;
            
            return true; 
        }
        
        return false
    }
}