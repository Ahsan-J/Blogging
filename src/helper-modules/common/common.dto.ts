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
    
    // first_page_url: string;
    // last_page_url: string;
    // next_page_url: string;
    // prev_page_url: string;
    
    @IsNumber({allowNaN: false})
    from: number;
    
    @IsNumber({allowNaN: false})
    to: number;
}