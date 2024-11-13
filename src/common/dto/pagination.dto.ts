import { IsNumber, IsNumberString, IsOptional } from "class-validator";

export class PaginationQuery {
    
    @IsNumberString()
    @IsOptional()
    page = '1';

    @IsNumberString()
    @IsOptional()
    pageSize: string;
}

export class PaginationMeta {
    
    @IsNumber({allowNaN: false})
    total: number;
    
    @IsNumber({allowNaN: false})
    page_size: number;
    
    @IsNumber({allowNaN: false})
    current_page: number;
    
    @IsNumber({allowNaN: false})
    last_page: number;
    
    @IsNumber({allowNaN: false})
    from: number;
    
    @IsNumber({allowNaN: false})
    to: number;

    constructor(count: number, current_page: number, page_size: number) {
        if(page_size < 1) {
            throw new Error("Page size must be greater than 1")
        }

        if(current_page < 1) {
            throw new Error("Current Page must be greater than or equals to 1")
        }

        this.from = (current_page - 1) * page_size
        this.to = current_page * page_size
        this.total =  count
        this.current_page = current_page
        this.last_page = Math.ceil(count / page_size),
        this.page_size = page_size
    }
}