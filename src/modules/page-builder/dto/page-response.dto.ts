
import { ObjectType } from "@/common/types/collection.type";
import { Page } from "../entity/page.entity";
import { PageType } from "../page.enum";
import { RowResponse } from "./row-response.dto";

export class PageResponse {

    async lazyFetch(page: Page): Promise<PageResponse> {

        this.alias = page.alias;
        this.name = page.name;
        this.pageType  = page.pageType;
        this.customCss = page.customCss;
        this.isActive = page.isActive;
        this.customJs = page.customJs;
        this.meta = page.meta;
        this.password = page.password;

        for(const row of await page.rows) {
            this.rows.push(await new RowResponse().lazyFetch(row))
        }

        return this
    }

    constructor(page?: Page) {
        if(!page) return this;
        this.alias = page.alias;
        this.name = page.name;
        this.pageType  = page.pageType;
        this.customCss = page.customCss;
        this.isActive = page.isActive;
        this.customJs = page.customJs;
        this.meta = page.meta;
        this.password = page.password;
        this.rows = page.rows.map(r => new RowResponse(r))
    }

    name: string;
    alias: string;
    pageType: PageType;
    customJs: string;
    customCss: string;
    meta?: ObjectType<string>;
    password?: string;
    rows: Array<RowResponse> = [];    
    isActive: boolean 
}