import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { nanoid } from "nanoid";
import { User } from "src/modules/user/user.entity";
import { ITokenData } from "./token.type";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { isAfter, parseISO, subDays } from "date-fns";

@Injectable()
export class TokenService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    async generateToken(user: User) {

        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            user.id,
            user.role,
            new Date().toISOString(),
        ];

        const text = Buffer.from(`${keyFactors.join('|')}`).toString('base64');

        return text
    }

    async validateAccessToken(headers: Request['headers']): Promise<boolean> {

        if (!headers.authorization) {
            throw new UnauthorizedException("Authorization token is missing");
        }

        const {
            appId,
            tokenTime,
        } = this.getTokenData(headers);

        if (appId !== this.configService.get("APP_ID")) {
            throw new ForbiddenException("App id is invalid")
        }

        const date = parseISO(tokenTime)
        const expDate = subDays(new Date(), 1);
        
        if (isAfter(date, expDate)) {
            throw new UnauthorizedException("Reset token expired its duration")
        }

        return true;
    }

    getTokenData(headers: Request['headers']): ITokenData {

        if (!headers.authorization) {
            throw new UnauthorizedException("Authorization token is missing");
        }

        const code = headers.authorization.replace('Bearer ', '');

        const [
            tokenId,
            appId,
            userId,
            userRole,
            tokenTime,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");

        return {
            tokenId,
            appId,
            userId,
            userRole: parseInt(userRole),
            tokenTime,
        }
    }
}