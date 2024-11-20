import { DataSeeder } from "@/common/interface/seeder.interface";
import { Injectable, Logger } from "@nestjs/common";
import { Page } from "./entity/page.entity";
import { Component } from "./entity/component.entity";
import { PageRepository } from "./repository/page.repository";
import { PageComponent } from "./entity/page-component.entity";
import { Cell } from "./entity/cell.entity";
import { Row } from "./entity/row.entity";

@Injectable()
export class PageBuilderDataSeeder implements DataSeeder<Page> {

    private logger = new Logger(PageBuilderDataSeeder.name)

    constructor(
        private pageRepository: PageRepository,
    ) { }

    async seed(data: Partial<Page>[]) {
        for (const partialPage of data) {
            if (!await this.pageRepository.findOne({ where: { id: partialPage.id } })) {
                this.logger.log(`Adding user ${partialPage.id}`)
                await this.pageRepository.save(this.createPage(partialPage))
            }
        }
    }
    
    private createComponent(data: Partial<Component>): Component {
        const component = new Component();

        component.id = data.id || component.id;
        component.name = this.getOrFallback(data.name);
        component.identifier = this.getOrFallback(data.identifier);
        component.category = this.getOrFallback(data.category);
        component.description = this.getOrFallback(data.description);
        component.thumbnail = this.getOrFallback(data.thumbnail);
        component.isActive = true;

        return component;
    }

    private createPageComponent(data: Partial<PageComponent>): PageComponent {
        const pageComponent = new PageComponent();

        pageComponent.id = data.id || pageComponent.id;
        pageComponent.name = this.getOrFallback(data.name);
        pageComponent.component = this.createComponent(data.component!) || pageComponent.component;
        pageComponent.attributes = data.attributes || pageComponent.attributes;
        pageComponent.parent = data.parent || pageComponent.parent;
        pageComponent.isActive = true;

        return pageComponent;
    }

    private createCell(data: Partial<Cell>): Cell {
        const cell = new Cell();

        cell.id = data.id || cell.id;
        cell.attributes = data.attributes || cell.attributes;
        cell.components = data.components?.map(component => this.createPageComponent(component)) || []
        cell.isActive = true;

        cell.rows = data.rows?.map(row => {
            const cellRow = this.createRow(row)
            cellRow.parentCell = cell;
            return cellRow;
        }) || [];
        
        return cell;
    }

    private createRow(data: Partial<Row>): Row {
        const row = new Row();

        row.id = data.id || row.id;
        row.attributes = data.attributes || row.attributes;
        row.cells = data.cells?.map(cell => this.createCell(cell)) || [];
        row.isActive = true;
        row.layout = this.getOrFallback(data.layout, "12");
        row.meta = data.meta || row.meta;

        return row;
    }

    private createPage(data: Partial<Page>): Page {
        const page = new Page();
        page.id = data.id || page.id;
        return page
    }

    private getOrFallback<T extends (string | number)>(value?: T | null, fallback?: T): T {
        const fallbackValue = typeof fallback === 'string' ? (fallback || "" as T) : (fallback || 0 as T);
        return typeof value == "undefined" || value == null ? fallbackValue : value;
    }
}