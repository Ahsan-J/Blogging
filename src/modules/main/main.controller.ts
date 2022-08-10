import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ContactPortfolioForm } from "./main.dto";

import { MailService } from '../../helper-modules/mail/mail.service'
import { MainService } from "./main.service";
import { ConfigService } from "@nestjs/config";

@ApiTags('Index')
@Controller()
export class MainController {
    
    constructor(
        private mailService: MailService,
        private mainService: MainService,
        private configService: ConfigService
    ) {}
    
    @Post('contact')
    async submitPortfolioContact(@Body() data:ContactPortfolioForm) {
        const contactInfo = await this.mainService.saveContactInfo(data);
        await this.mailService.sendEmailTemplate({
            from: `"${data.name}"<${this.configService.get("SMTP_USER")}>`,
            subject: `${data.subject} - ${data.email}`,
            markup:  `
                <h5 style="margin:0;">${contactInfo.id}</h5>
                <p style="margin:0;">Name: ${data.name}</p>  
                <p style="margin:0;">Email: ${data.email}</p>
                <p>Message: ${data.message}</p>
            `,
        })
        return "Email Sent!"
    }

    @Get()
    async index() {
        return "It is working"
    }
}