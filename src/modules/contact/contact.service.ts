import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactPortfolioForm } from "./contact.dto";
import { Contacts } from "./contact.entity";
import { ContactRepository } from "./contact.repository";
import { MailService } from "@/shared/mail/mail.service";

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

        this.mailService.notifyContact(contactInfo)
        
        return savedContactInfo
    }
}