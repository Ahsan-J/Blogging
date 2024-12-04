import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactPortfolioForm } from "./contact.dto";
import { Contacts } from "./contact.entity";
import { ContactRepository } from "./contact.repository";
import { MailService } from "@/shared/mail/mail.service";
import { SendEmailRequest } from "@/shared/mail/mail.type";
import { ObjectType } from "@/common/types/collection.type";

@Injectable()
export class ContactService {
    constructor(
        @InjectRepository(Contacts)
        private contactRepository: ContactRepository,
        private mailService: MailService
    ) {}
    
    async saveContactInfo(data: ContactPortfolioForm): Promise<Contacts> {

        const contactInfo =  await this.contactRepository.create({
            email: data.email,
            message: data.message,
            name: data.name,
            subject: data.subject,
        });

        contactInfo.isRead = false

        const savedContactInfo = await this.contactRepository.save(contactInfo)

        this.notifyContact(contactInfo)
        
        return savedContactInfo
    }

    private async notifyContact(contactInfo: Contacts) {
        
        const emailConfig: SendEmailRequest<ObjectType> = {
            to: contactInfo.email,
            from: "",
            data: {},
            subject: "",
            template: ""
        }

        return await this.mailService.sendEmail(emailConfig)
    }
}