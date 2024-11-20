import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Page } from "./page.entity";
import { Cell } from "./cell.entity";
import { Row } from "./row.entity";
import { Component } from "./component.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Page, Row, Cell, Component])
    ]
})
export class PageBuilderModule {}