import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "./entity/page.entity";
import { Cell } from "./entity/cell.entity";
import { Row } from "./entity/row.entity";
import { PageComponents } from "./entity/page-component.entity";
import { PageBuilderController } from "./page-builder.controller";
import { UserModule } from "@/modules/user/user.module";
import { Component } from "./entity/component.entity";
import { PageBuilderService } from "./page-builder.service";
import { PageRepository } from "./repository/page.repository";
import { ComponentRepository } from "./repository/page-component.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([Page, Row, Cell, PageComponents, Component]),
        UserModule,
    ],
    controllers: [PageBuilderController],
    providers: [PageBuilderService, PageRepository, ComponentRepository],
    exports: [PageBuilderService]
})
export class PageBuilderModule {}