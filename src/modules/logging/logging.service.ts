import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Log } from "./logging.entity";
import { ICreateLog } from "./logging.type";
import { PaginateData, PaginatedFindParams, PaginationMeta } from "@/common/dto/pagination.dto";
import { LogResponse } from "./logging.dto";

@Injectable()
export class LoggingService {
    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>,
        ) {}

    async getLogs(options: PaginatedFindParams<Log>): Promise<PaginateData<LogResponse>> {
        
        const [result, count] = await this.logRepository.findAndCount(options.toFindOption());

        const meta = new PaginationMeta(count, options.page, options.pageSize);
        const logResponseList = result.map(l => new LogResponse(l))
        
        return new PaginateData(logResponseList, meta)
    }

    async createLog(createLogParam: ICreateLog): Promise<LogResponse> {
        
        const log = await this.logRepository.save({
            message: createLogParam.message,
            data: createLogParam.data,
            file_path: createLogParam.file_path,
            route: createLogParam.route,
        })

        return new LogResponse(log)
    }
}