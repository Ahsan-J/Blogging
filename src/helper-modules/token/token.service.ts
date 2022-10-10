import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import moment from "moment";
import { nanoid } from "nanoid";
import { User } from "src/modules/user/user.entity";
import { UAParser } from "ua-parser-js";
import { CacheService } from "../cache/cache.service";
import { ITokenData } from "./token.type";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/modules/user/user.service";

@Injectable()
export class TokenService {
    constructor(
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService,
        private readonly userService: UsersService,
    ) { }
    async generateToken(user: User, headers: Request['headers']) {

        const parser = new UAParser();
        parser.setUA(headers['user-agent']);

        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            user.id,
            user.role,
            parser.getDevice().type || "",
            parser.getBrowser().name || "",
            moment().toISOString(),
        ];

        const text = Buffer.from(`${keyFactors.join('|')}`).toString('base64');

        await this.cacheService.set(`${user.id}_${parser.getBrowser().name || ""}_${parser.getDevice().type || ""}`, text);
        return text
    }

    async validateAccessToken(headers: Request['headers']): Promise<boolean> {

        if (!headers.authorization) {
            throw new UnauthorizedException("Authorization token is missing");
        }

        const parser = new UAParser();
        parser.setUA(headers['user-agent']);

        const {
            appId,
            tokenTime,
        } = this.getTokenData(headers);

        // if (await this.cacheService.get(`${userId}_${browser}_${deviceType}`) !== code) {
        //     throw new UnauthorizedException("Invalid Authorization token")
        // }

        if (appId !== this.configService.get("APP_ID")) {
            throw new ForbiddenException("App id is invalid")
        }

        if (!moment(tokenTime).isBetween(moment().subtract(1, 'day'), moment())) {
            throw new UnauthorizedException("Reset token expired its duration")
        }

        return true;
    }

    async removeToken(headers: Request['headers']): Promise<any> {


        if (!headers.authorization) {
            throw new UnauthorizedException("Authorization token is missing");
        }

        const { userId, deviceType, browser } = this.getTokenData(headers);

        return await this.cacheService.del(`${userId}_${browser}_${deviceType}`)
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
            deviceType,
            browser,
            tokenTime,
        ] = Buffer.from(code, 'base64').toString('ascii').split("|");

        return {
            tokenId,
            appId,
            userId,
            userRole: parseInt(userRole),
            deviceType,
            browser,
            tokenTime,
        }
    }

    async getTokenUser(headers: Request['headers']): Promise<User> {
        const { userId } = this.getTokenData(headers);

        return await this.userService.getUser(userId);
    }
}