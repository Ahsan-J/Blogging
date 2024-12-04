import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "./entity/page.entity";
import { Cell } from "./entity/cell.entity";
import { Row } from "./entity/row.entity";
import { Component } from "./entity/component.entity";
import { PageBuilderController } from "./page-builder.controller";
import { UserModule } from "@/modules/user/user.module";
import { PageBuilderService } from "./page-builder.service";
import { PageRepository } from "./repository/page.repository";
import { PageBuilderDataSeeder } from "./page-builder.seeder";
import PageBuilderData from './page-builder.data.json';
import { ComponentRepository } from "./repository/component.repository";
import { RowRepository } from "./repository/row.repository";
import { CellRepository } from "./repository/cell.repository";
@Module({
    imports: [
        TypeOrmModule.forFeature([Page, Row, Cell, Component]),
        UserModule,
    ],
    controllers: [PageBuilderController],
    providers: [
        PageBuilderService,
        PageRepository,
        ComponentRepository,
        RowRepository,
        CellRepository,
        PageBuilderDataSeeder
    ],
    exports: [PageBuilderService]
})
export class PageBuilderModule implements OnApplicationBootstrap {
    constructor(public readonly seeder: PageBuilderDataSeeder) { }

    onApplicationBootstrap() {
        this.seeder.seed(PageBuilderData as never);
    }
}