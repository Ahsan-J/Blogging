import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { Transporter } from 'nodemailer';
import { NODEMAILER_TRANSPORTER } from "./mail.constant";
import { SendEmailRequest } from "./mail.type";
import { handlebars } from 'hbs';
import fs from 'fs';
import path from 'path';

@Injectable()
export class MailService {

    constructor(
        @Inject(NODEMAILER_TRANSPORTER)
        private readonly transporter: Transporter,
    ){}

    private logger = new Logger(MailService.name)

    async sendEmail<T>(options: SendEmailRequest<T>) {

        const templateFile = await this.readFile(options.template);
        const rawTemplate = await handlebars.compile(templateFile);
        const markup = rawTemplate(options.data);

        // send mail with defined transport object
        const response = await this.transporter.sendMail({
            from: options.from, // sender address
            to: options.to, // list of receivers
            subject: options.subject, // Subject line
            html: markup, // pass user
        });

        if(response.rejected.includes(options.to)) {
            this.logger.error(response.rejected);
            throw new BadRequestException("Email cannot be sent to user at the moment")
        }

        this.logger.log(`Email sent to ${options.to} `)
        
        return response;
    }

    private readFile(template: string): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path.join(process.cwd(), 'views', `${template}.hbs`), 'utf-8', (err, data) => {
                if(err) reject(err);
                resolve(data);
            })
        })
    }
}