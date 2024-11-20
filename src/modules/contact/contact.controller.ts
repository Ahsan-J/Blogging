import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ContactPortfolioForm } from "./contact.dto";
import { ContactService } from "./contact.service";

@ApiTags('Contact Form')
@Controller('contact')
export class ContactController {
    
    constructor(
        private contactService: ContactService,
    ) {}
    
    @Post()
    async submitPortfolioContact(@Body() data:ContactPortfolioForm) {
        return await this.contactService.saveContactInfo(data);
    }
}