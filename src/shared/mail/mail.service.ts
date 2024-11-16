import { Contacts } from "@/modules/contact/contact.entity";
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {

    constructor(private readonly configService: ConfigService ){}

    private logger = new Logger()
    
    transporter: nodemailer.Transporter;

    get port(): number { return parseInt(`${this.configService.get("SMTP_PORT", "0")}`, 10); }
    get host(): string { return this.configService.get("SMTP_HOST", "");}
    get user(): string { return this.configService.get("SMTP_USER", "");}
    get password(): string { return this.configService.get("SMTP_PASSWORD", "");}

    onModuleInit() {
        this.transporter = nodemailer.createTransport({
            host: this.host,
            port: this.port,
            secure: true,
            auth: {
                user: this.user, // generated ethereal user
                pass: this.password, // generated ethereal password
            },
        });
    }

    onModuleDestroy() {
        this.transporter.close();
    }

    // async sendEmailTemplate(options: {from?: string, to?: string, subject?: string, markup?: string}) {
    //     // send mail with defined transport object
    //     const to = options.to || "ahsan.ahmed99@ymail.com"
    //     const response = await this.transporter.sendMail({
    //         from: options.from, // sender address
    //         to, // list of receivers
    //         subject: options.subject, // Subject line
    //         html: options.markup, // pass user
    //     });

    //     if(response.rejected.includes(to)) {
    //         this.logger.log("Email rejected by nodemailer", {
    //             from: options.from, // sender address
    //             to, // list of receivers
    //             subject: options.subject, // Subject line
    //             html: options.markup
    //         })
    //         throw new BadRequestException("Email cannot be sent to user at the moment")
    //     }

    //     return response;
    // }

    async notifyContact(contact: Contacts) {
        this.logger.log(contact)
    }

    async sendResetCode(email: string, code: string) {
        this.logger.log(email, code)
    }

    async sendActivationCode(email: string, code: string) {
        this.logger.log(email, code)
    }
}