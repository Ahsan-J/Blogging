import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaginateData, PaginatedFindParams, PaginationQuery } from "@/common/dto/pagination.dto";
import { SieveFilter } from "@/common/pipes/sieve-filter.pipe";
import { FindOptionsWhere } from "typeorm";
import { Log } from "./logging.entity";
import { LoggingService } from "./logging.service";
import { SieveSort } from "@/common/pipes/sieve-sort.pipe";
import { ObjectType } from "@/common/types/collection.type";
import { LogResponse } from "./logging.dto";

@ApiTags('Logs')
@Controller('logs')
export class LoggingController {
    constructor(
        private loggingService: LoggingService,
    ) { }

    @Get()
    async getLogErrors(
        @Query() query: PaginationQuery, 
        @Query('filters', SieveFilter) filters: Array<FindOptionsWhere<Log>>, 
        @Query('sorts', SieveSort) sorts: ObjectType
    ): Promise<PaginateData<LogResponse>> {
        const findParams = new PaginatedFindParams(query, filters, sorts)
        return await this.loggingService.getLogs(findParams)
    }
}