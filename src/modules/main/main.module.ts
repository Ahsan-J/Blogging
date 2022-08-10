import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "src/helper-modules/mail/mail.module";
import { MainController } from "./main.controller";
import { Contacts } from "./main.entity";
import { MainService } from "./main.service";

@Module({
    imports:[
        MailModule,
        ConfigModule,
        TypeOrmModule.forFeature([Contacts]),
    ],
    controllers: [MainController],
    exports: [MainService],
    providers: [MainService]
})
export class MainModule {}