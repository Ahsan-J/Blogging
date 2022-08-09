import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";
import { ContactPortfolioForm } from "./main.dto";
import { Contacts } from "./main.entity";
import { ContactStatus } from "./main.enum";

@Injectable()
export class MainService {
    constructor(
        @InjectRepository(Contacts)
        private contactRepository: Repository<Contacts>
    ) {}
    
    async saveContactInfo(data: ContactPortfolioForm): Promise<Contacts> {
        return await this.contactRepository.save({
            id: nanoid(),
            email: data.email,
            message: data.message,
            name: data.name,
            subject: data.subject,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
            deleted_at: null,
            status: ContactStatus.Unread,
        })
    }   
}