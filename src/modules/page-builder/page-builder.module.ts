import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "./entity/page.entity";
import { Cell } from "./entity/cell.entity";
import { Row } from "./entity/row.entity";
import { PageComponent } from "./entity/page-component.entity";
import { PageBuilderController } from "./page-builder.controller";
import { UserModule } from "@/modules/user/user.module";
import { Component } from "./entity/component.entity";
import { PageBuilderService } from "./page-builder.service";
import { PageRepository } from "./repository/page.repository";
import { ComponentRepository } from "./repository/page-component.repository";
import { PageBuilderDataSeeder } from "./page-builder.seeder";

@Module({
    imports: [
        TypeOrmModule.forFeature([Page, Row, Cell, PageComponent, Component]),
        UserModule,
    ],
    controllers: [PageBuilderController],
    providers: [PageBuilderService, PageRepository, ComponentRepository, PageBuilderDataSeeder],
    exports: [PageBuilderService]
})
export class PageBuilderModule implements OnApplicationBootstrap{
    constructor(public readonly seeder: PageBuilderDataSeeder){}

  onApplicationBootstrap() {
    this.seeder.seed([]);
  }
}