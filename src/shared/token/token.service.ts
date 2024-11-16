import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { nanoid } from "nanoid";
import { addYears, isAfter, parseISO } from "date-fns";
import { TokenOptions } from "./token.type";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenService {
    constructor(
        private readonly configService: ConfigService,
    ) { }

    private character = "|"

    generateToken(parameters: Array<string | number | undefined | null>, options: TokenOptions | null = null): string {

        if(!parameters.length) {
            throw new BadRequestException("Parameters are empty")
        }

        const filteredParameters: Array<string | number> = parameters.filter((p): p is string | number => !!p)
        const expirationDate = options?.expiration || addYears(new Date(),1)

        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            new Date().toISOString(),
            expirationDate.toISOString(),
            ...filteredParameters,
        ];

        return this.encryptToken(keyFactors.map(t => `${t}`))
    }

    validateAccessToken(token: string): boolean {
        if(!token) {
            throw new BadRequestException("toke is missing")
        }

        const [ ,appId, tokenTime, expirationTime ] = this.decryptToken(token)

        if (appId !== this.configService.get("APP_ID")) {
            throw new ForbiddenException("App id is invalid")
        }

        if (isAfter(parseISO(tokenTime), parseISO(expirationTime))) {
            throw new UnauthorizedException("Token expired its duration")
        }

        return true;
    }

    getTokenData(token: string): Array<string> {
        this.validateAccessToken(token)
        const [ 
            /* tokenId */, 
            /* appId */, 
            /* tokenTime */, 
            /* expirationTime */, 
            ...parameters
        ] = this.decryptToken(token)
        return parameters
    }

    private encryptToken(parameters: Array<string>): string {
        return Buffer.from(`${parameters.join(this.character)}`).toString('base64')
    }

    private decryptToken(token: string): Array<string> {
        return Buffer.from(token.replace('Bearer ', ''), 'base64').toString('ascii').split(this.character);
    }
}