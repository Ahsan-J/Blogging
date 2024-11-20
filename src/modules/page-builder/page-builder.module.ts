import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "./entities/page.entity";
import { Cell } from "./entities/cell.entity";
import { Row } from "./entities/row.entity";
import { Component } from "./entities/component.entity";
import { PageBuilderController } from "./page-builder.controller";
import { UserModule } from "@/modules/user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Page, Row, Cell, Component]),
        UserModule,
    ],
    controllers: [PageBuilderController]
})
export class PageBuilderModule {}