import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { nanoid } from "nanoid";
import { User } from "../user/user.entity";
import { join } from 'path';
import { readFileSync } from "fs";
import { TokenService } from "@/shared/token/token.service";

@Injectable()
export class AuthService {

    constructor(
        private configService: ConfigService,
        private tokenService: TokenService
    ) { }

    // Reset Process ************************************************************

    async generateResetCode(userInfo: User): Promise<string> {
        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            userInfo.email,
            new Date().toISOString(),
        ];

        const text = Buffer.from(`${keyFactors.join('|')}`).toString('base64');
        return text
    }

    async validateResetCode(userInfo: User, code: string): Promise<boolean> {
        if(!code) {
            throw new BadRequestException("Reset Code is missing")
        }

        const [, appId, userId, time] = Buffer.from(code, 'base64').toString('ascii').split("|");

        if(appId !== this.configService.get("APP_ID")) {
            throw new BadRequestException("Invalid Reset code for App")
        }

        if(userId !== userInfo.id) {
            throw new BadRequestException("Invalid Reset for matching User")
        }

        // if(!moment(time).isBetween(moment().subtract(1, 'day'), moment())) {
        //     throw new UnauthorizedException("Reset token expired its duration")
        // }

        return true;
    }

    async generateResetMarkup(user: User, code?: string): Promise<string> {
        code = code || await this.generateResetCode(user);
        const filePath = join(process.cwd(), 'template', "reset-password.hbs");
        const markup = readFileSync(filePath, { encoding: "utf-8" })

        // Handlebars.registerHelper("link_code", (t) => {
        //     const url = Handlebars.escapeExpression(`http://localhost:3000/auth/reset-password?code=${code}&email=${user.email}`)
        //     const text = Handlebars.escapeExpression(t)
        //     return new Handlebars.SafeString("<a href='" + url + "'>" + text + "</a>");
        // });

        // const template = Handlebars.compile(markup);
        return ""
    }

    // Activation Process *********************************************************
    async generateActivationCode(userInfo: User): Promise<string> {
        const keyFactors = [
            nanoid(), // Token Id
            this.configService.get("APP_ID"),
            userInfo.id,
            new Date().toISOString(),
        ];

        const text = Buffer.from(`${keyFactors.join('|')}`).toString('base64');
        return text
    }

    async validateActivationCode(userInfo: User, code: string): Promise<boolean> {
        if(!code) {
            throw new BadRequestException("Reset Code is missing")
        }

        const [, appId, userId, time] = Buffer.from(code, 'base64').toString('ascii').split("|")
        
        if(appId !== this.configService.get("APP_ID")) {
            throw new BadRequestException("Invalid Activation code for App")
        }

        if(userId !== userInfo.id) {
            throw new BadRequestException("Invalid Activation for matching User")
        }

        // if(!moment(time).isBetween(moment().subtract(1, 'day'), moment())) {
        //     throw new BadRequestException("Activation token expired its duration")
        // }

        return true;
    }

    async generateActivationMarkup(user: User, code?: string): Promise<string> {

        code = code || await this.generateActivationCode(user)

        const filePath = join(process.cwd(), 'template', "activation.hbs");
        const markup = readFileSync(filePath, { encoding: "utf-8" })

        // Handlebars.registerHelper("link_code", (t) => {
        //     const url = Handlebars.escapeExpression(`http://localhost:3000/auth/activate?code=${code}&id=${user.id}`)
        //     const text = Handlebars.escapeExpression(t)
        //     return new Handlebars.SafeString("<a href='" + url + "'>" + text + "</a>");
        // });

        // const template = Handlebars.compile(markup);
        // return template({ user })
        return "";
    }
}