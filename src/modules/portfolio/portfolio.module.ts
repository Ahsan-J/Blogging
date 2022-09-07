import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "src/helper-modules/mail/mail.module";
import { PortfolioController } from "./portfolio.controller";
import { Contacts } from "./portfolio.entity";
import { PortfolioService } from "./portfolio.service";

@Module({
    imports:[
        MailModule,
        ConfigModule,
        TypeOrmModule.forFeature([Contacts]),
    ],
    controllers: [PortfolioController],
    exports: [PortfolioService],
    providers: [PortfolioService]
})
export class PortfolioModule {}