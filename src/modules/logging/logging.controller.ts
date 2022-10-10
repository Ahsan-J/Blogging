import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaginationMeta, PaginationQuery } from "src/helper-modules/common/common.dto";
import { CommonService } from "src/helper-modules/common/common.service";
import { Sieve } from "src/helper/sieve.pipe";
import { FindOptionsWhere } from "typeorm";
import { Log } from "./logging.entity";
import { LoggingService } from "./logging.service";

@ApiTags('Logs')
@Controller('logs')
export class LoggingController {
    constructor(
        @Inject(CommonService)
        private commonService: CommonService,
        private loggingService: LoggingService,
    ) { }

    @Get()
    async getLogErrors(@Query() query: PaginationQuery, @Query('filters', Sieve) filters: Array<FindOptionsWhere<Log>>, @Query('sorts', Sieve) sorts): Promise<Array<Log> | { meta: PaginationMeta }> {
        const page = parseInt(query.page || '1');
        const pageSize = parseInt(query.pageSize || '10');

        const [data, count] = await this.loggingService.getLogs({
            skip: (page - 1) * pageSize,
            take: pageSize,
            where: filters,
            order: sorts,
        })

        const meta = this.commonService.generateMeta(count, page, pageSize);

        return {
            ...data,
            meta
        }
    }
}