import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ContactPortfolioForm } from "./main.dto";

import { MailService } from '../../helper-modules/mail/mail.service'
import { MainService } from "./main.service";

@ApiTags('Index')
@Controller()
export class MainController {
    
    constructor(
        private mailService: MailService,
        private mainService: MainService,
    ) {}
    
    @Post('contact')
    async submitPortfolioContact(@Body() data:ContactPortfolioForm) {
        await this.mainService.saveContactInfo(data);
        await this.mailService.sendEmailTemplate({
            from: `"${data.name}"<${data.email}>`,
            markup:  data.message,
            subject: `${data.subject} - ${data.email}`,
        })
        return "Email Sent!"
    }

    @Get()
    async index() {
        return "It is working"
    }
}