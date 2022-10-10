import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContactPortfolioForm } from "./portfolio.dto";
import { Contacts } from "./portfolio.entity";
import { ContactStatus } from "./portfolio.enum";

@Injectable()
export class PortfolioService {
    constructor(
        @InjectRepository(Contacts)
        private contactRepository: Repository<Contacts>
    ) {}
    
    async saveContactInfo(data: ContactPortfolioForm): Promise<Contacts> {
        return await this.contactRepository.save({
            email: data.email,
            message: data.message,
            name: data.name,
            subject: data.subject,
            status: ContactStatus.Unread,
        })
    }   
}