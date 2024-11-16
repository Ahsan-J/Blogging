import { IsNumber, IsNumberString, IsOptional } from "class-validator";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { applyFiltersToQueryBuilder } from "../utils/sieve.utility";

export class PaginationQuery {
    
    @IsNumberString()
    @IsOptional()
    page = '1';

    @IsNumberString()
    @IsOptional()
    pageSize: string = '10';
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

    constructor(count: number, page: number = 1, pageSize: number = 10) {
        if(pageSize < 1) {
            throw new Error("Page size must be greater than 1")
        }

        if(page < 1) {
            throw new Error("Current Page must be greater than or equals to 1")
        }

        this.from = (page - 1) * pageSize
        this.to = page * pageSize
        this.total =  count
        this.current_page = page
        this.last_page = Math.ceil(count / pageSize)
        this.page_size = pageSize
    }
}

export class PaginatedFindParams<T extends ObjectLiteral> {
    public page = 1;
    public pageSize = 10;

    constructor(
        paginatedQuery?: PaginationQuery,
        private filters?: Array<FindOptionsWhere<T>>,
        private sorts?: FindOptionsOrder<T>
    ) {
        if(paginatedQuery && 'page' in paginatedQuery) this.page = parseInt(paginatedQuery.page, 10)
        if(paginatedQuery && 'pageSize' in paginatedQuery) this.pageSize = parseInt(paginatedQuery.pageSize, 10)
    }

    toFindOption(): FindManyOptions<T> {
        const options: FindManyOptions<T> = {
            skip: (this.page - 1) * this.pageSize,
            take: this.page * this.pageSize    
        }

        if(this.filters) options.where = this.filters
        if(this.sorts) options.order = this.sorts

        return options
    }

    applyFilters(queryBuilder: SelectQueryBuilder<T>): SelectQueryBuilder<T> {
        return applyFiltersToQueryBuilder(queryBuilder, this.filters);
    }

    applySorts(queryBuilder: SelectQueryBuilder<T>) {
        // queryBuilder.orderBy(this.sorts)
        return queryBuilder;
    }
}

export class PaginateData<T> {
    constructor(
        public readonly data: Array<T>,
        public readonly meta: PaginationMeta,
    ) {}
}