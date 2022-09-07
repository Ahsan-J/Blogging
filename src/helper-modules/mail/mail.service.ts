import { BadRequestException, Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from 'nodemailer';
import { LoggingService } from "src/modules/logging/logging.service";

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(LoggingService)
        private loggingService: LoggingService,
        private configService: ConfigService,
    ){}
    
    transporter: nodemailer.Transporter;

    onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: parseInt(this.configService.get("SMTP_PORT")),
            secure: true,
            auth: {
                user: this.configService.get("SMTP_USER"), // generated ethereal user
                pass: this.configService.get("SMTP_PASSWORD"), // generated ethereal password
            },
        });
    }

    onModuleDestroy() {
        this.transporter.close();
    }

    async sendEmailTemplate(options: {from?: string, to?: string, subject?: string, markup?: string}) {
        // send mail with defined transport object
        const to = options.to || "ahsan.ahmed99@ymail.com"
        const response = await this.transporter.sendMail({
            from: options.from, // sender address
            to, // list of receivers
            subject: options.subject, // Subject line
            html: options.markup, // pass user
        });

        if(response.rejected.includes(to)) {
            this.loggingService.createLog({
                message: "Email rejected by nodemailer",
                data: JSON.stringify({
                    from: options.from, // sender address
                    to, // list of receivers
                    subject: options.subject, // Subject line
                    html: options.markup
                }),
                file_path: "mail.service.ts",
                route: null,
            })
            throw new BadRequestException("Email cannot be sent to user at the moment")
        }

        return response;
    }
}