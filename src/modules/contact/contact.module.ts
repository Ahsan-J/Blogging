import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "@/shared/mail/mail.module";
import { ContactController } from "./contact.controller";
import { Contacts } from "./contact.entity";
import { ContactService } from "./contact.service";

@Module({
    imports:[
        MailModule,
        ConfigModule,
        TypeOrmModule.forFeature([Contacts]),
    ],
    controllers: [ContactController],
    exports: [ContactService],
    providers: [ContactService]
})
export class ContactModule {}