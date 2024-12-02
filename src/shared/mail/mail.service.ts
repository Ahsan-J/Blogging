import { Contacts } from "@/modules/contact/contact.entity";
import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { Transporter } from 'nodemailer';
import { NODEMAILER_TRANSPORTER } from "./mail.constant";

@Injectable()
export class MailService {

    constructor(
        @Inject(NODEMAILER_TRANSPORTER)
        private readonly transporter: Transporter,
    ){}

    private logger = new Logger(MailService.name)

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
            throw new BadRequestException("Email cannot be sent to user at the moment")
        }

        return response;
    }

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