import { DataSeeder } from "@/common/interface/seeder.interface";
import { Injectable, Logger } from "@nestjs/common";
import { Page } from "./entity/page.entity";
import { Component } from "./entity/component.entity";
import { PageRepository } from "./repository/page.repository";
import { Cell } from "./entity/cell.entity";
import { Row } from "./entity/row.entity";
import { DeepPartial } from "@/common/types/collection.type";
import { ComponentRepository } from "./repository/component.repository";
import { CellRepository } from "./repository/cell.repository";
import { RowRepository } from "./repository/row.repository";

@Injectable()
export class PageBuilderDataSeeder implements DataSeeder<Page> {

    private logger = new Logger(PageBuilderDataSeeder.name)

    constructor(
        private pageRepository: PageRepository,
        private cellRepository: CellRepository,
        private rowRepository: RowRepository,
        private componentRepository: ComponentRepository,
    ) { }

    async seed(data: DeepPartial<Page>[]) {
        for (const partialPage of data) {
            if (!await this.pageRepository.findOne({ where: { id: partialPage.id } })) {
                const page = await this.createPage(partialPage)
                this.logger.log(`Adding page ${page.id}`)
                await this.pageRepository.save(page)
            }
        }
    }
    
    private async createComponent(data: Partial<Component>): Promise<Component> {

        const existing = await this.componentRepository.findOne({ where: { id: data.id } })
        if(existing) return existing

        const component = this.componentRepository.create()

        component.id = data.id || component.id;
        component.name = this.getOrFallback(data.name);
        component.identifier = this.getOrFallback(data.identifier);
        component.category = this.getOrFallback(data.category);
        component.description = this.getOrFallback(data.description);
        component.thumbnail = this.getOrFallback(data.thumbnail);
        component.isActive = true;
        component.attributes = data.attributes || component.attributes;

        this.logger.log("Creating Page Component", component.id)

        return await this.componentRepository.save(component);
    }

    private async createCell(data: Partial<Cell>): Promise<Cell> {

        const existing = await this.cellRepository.findOne({ where: { id: data.id } })
        if(existing) return existing

        const cell = this.cellRepository.create()

        cell.id = this.getOrFallback(data.id, cell.id);
        cell.attributes = data.attributes || cell.attributes;

        cell.isActive = true;

        cell.components = await this.getComponents(data.components)
        cell.rows = await this.getRows(data.rows)

        this.logger.log("Creating Cell", cell.id)

        return await this.cellRepository.save(cell);
    }

    private async getComponents(components?: Component[]): Promise<Array<Component>> {
        const _components = []
        for(const component of (components || [])) {
            _components.push(await this.createComponent(component))
        }
        return _components;
    }

    private async getRows(rows?: Row[]): Promise<Array<Row>> {
        const _rows = []
        for(const row of (rows || [])){
            _rows.push(await this.createRow(row));
        }
        return _rows;
    }

    private async getCells(cells?: Cell[]): Promise<Array<Cell>> {
        const _cells = []
        for(const row of (cells || [])){
            _cells.push(await this.createCell(row));
        }
        return _cells;
    }

    private async createRow(data: Partial<Row>): Promise<Row> {

        const existing = await this.rowRepository.findOne({ where: { id: data.id } })
        if(existing) return existing

        const row = this.rowRepository.create()

        row.id = data.id || row.id;
        row.attributes = data.attributes || row.attributes;
        row.title = data.title || row.title
        row.isActive = true;
        row.layout = this.getOrFallback(data.layout, "12");

        row.cells = await this.getCells(data.cells)

        this.logger.log("Creating Row", row.id)
        
        return await this.rowRepository.save(row);
    }

    private async createPage(data: Partial<Page>): Promise<Page> {
        const page = this.pageRepository.create()

        page.id = this.getOrFallback(data.id, page.id);
        page.alias = this.getOrFallback(data.alias);
        page.customCss = data.customCss || page.customCss;
        page.customJs = data.customJs || page.customJs;
        page.meta = data.meta || page.meta;
        page.name = this.getOrFallback(data.name);
        page.pageType = data.pageType || page.pageType;
        page.password = data.password;

        page.rows = await this.getRows(data.rows)
        
        return page
    }

    private getOrFallback<T extends (string | number)>(value?: T | null, fallback?: T): T {
        const fallbackValue = typeof fallback === 'string' ? (fallback || "" as T) : (fallback || 0 as T);
        return typeof value == "undefined" || value == null ? fallbackValue : value;
    }
}