import { DataSeeder } from "@/common/interface/seeder.interface";
import { Injectable, Logger } from "@nestjs/common";
import { Page } from "./entity/page.entity";
import { Component } from "./entity/component.entity";
import { PageRepository } from "./repository/page.repository";
import { PageComponent } from "./entity/page-component.entity";
import { Cell } from "./entity/cell.entity";
import { Row } from "./entity/row.entity";
import { DeepPartial } from "@/common/types/collection.type";
import { PageComponentRepository } from "./repository/page-component.repository";
import { ComponentRepository } from "./repository/component.repository";
import { CellRepository } from "./repository/cell.repository";
import { RowRepository } from "./repository/row.repository";

@Injectable()
export class PageBuilderDataSeeder implements DataSeeder<Page> {

    private logger = new Logger(PageBuilderDataSeeder.name)

    constructor(
        private pageRepository: PageRepository,
        private pageComponentRepository: PageComponentRepository,
        private cellRepository: CellRepository,
        private rowRepository: RowRepository,
        private componentRepository: ComponentRepository,
    ) { }

    async seed(data: DeepPartial<Page>[]) {
        for (const partialPage of data) {
            if (!await this.pageRepository.findOne({ where: { id: partialPage.id } })) {
                this.logger.log(`Adding user ${partialPage.id}`)
                await this.pageRepository.save(await this.createPage(partialPage))
            }
        }
    }
    
    private async createComponent(data: Partial<Component>): Promise<Component> {
        const component = new Component();

        component.id = data.id || component.id;
        component.name = this.getOrFallback(data.name);
        component.identifier = this.getOrFallback(data.identifier);
        component.category = this.getOrFallback(data.category);
        component.description = this.getOrFallback(data.description);
        component.thumbnail = this.getOrFallback(data.thumbnail);
        component.isActive = true;

        this.logger.log("Creating Component", component.id)

        const existing = await this.componentRepository.findOne({ where: { id: component.id } })
        if(existing) return existing
        return await this.componentRepository.save(component);
    }

    private async createPageComponent(data: Partial<PageComponent>): Promise<PageComponent> {
        const pageComponent = new PageComponent();

        pageComponent.id = data.id || pageComponent.id;
        pageComponent.name = this.getOrFallback(data.name);
        pageComponent.component = await this.createComponent(data.component!) || pageComponent.component;
        pageComponent.attributes = data.attributes || pageComponent.attributes;
        pageComponent.parent = data.parent || pageComponent.parent;
        pageComponent.isActive = true;

        this.logger.log("Creating Page Component", pageComponent.id)
        const existing = await this.pageComponentRepository.findOne({ where: { id: pageComponent.id } })
        if(existing) return existing

        return await this.pageComponentRepository.save(pageComponent);
    }

    private async createCell(data: Partial<Cell>): Promise<Cell> {
        const cell = new Cell();

        cell.id = data.id || cell.id;
        cell.attributes = data.attributes || cell.attributes;
        cell.components = data.components ? await Promise.all(data.components.map((component) => this.createPageComponent(component))) : []
        cell.isActive = true;

        cell.rows = data.rows ? await Promise.all(data.rows.map(async (row) => {
            const cellRow = await this.createRow(row)
            cellRow.parentCell = cell;
            return cellRow;
        })) : [];

        this.logger.log("Creating Cell", cell.id)
        const existing = await this.cellRepository.findOne({ where: { id: cell.id } })
        if(existing) return existing
        
        return await this.cellRepository.save(cell);
    }

    private async createRow(data: Partial<Row>): Promise<Row> {
        const row = new Row();

        row.id = data.id || row.id;
        row.attributes = data.attributes || row.attributes;
        row.cells = data.cells ? await Promise.all(data.cells.map(cell => this.createCell(cell))): [];
        row.isActive = true;
        row.layout = this.getOrFallback(data.layout, "12");

        this.logger.log("Creating Row", row.id)
        const existing = await this.rowRepository.findOne({ where: { id: row.id } })
        if(existing) return existing

        return await this.rowRepository.save(row);
    }

    private async createPage(data: Partial<Page>): Promise<Page> {
        const page = new Page();

        page.id = this.getOrFallback(data.id, page.id);
        page.alias = this.getOrFallback(data.alias);
        page.customCss = data.customCss || page.customCss;
        page.customJs = data.customJs || page.customJs;
        page.meta = data.meta || page.meta;
        page.name = this.getOrFallback(data.name);
        page.pageType = data.pageType || page.pageType;
        page.password = data.password;

        page.rows = data.rows ? await Promise.all(data.rows.map(async (row) => {
            const pageRow = await this.createRow(row)
            pageRow.page = page;
            return pageRow;
        })) : [];

        return page
    }

    private getOrFallback<T extends (string | number)>(value?: T | null, fallback?: T): T {
        const fallbackValue = typeof fallback === 'string' ? (fallback || "" as T) : (fallback || 0 as T);
        return typeof value == "undefined" || value == null ? fallbackValue : value;
    }
}