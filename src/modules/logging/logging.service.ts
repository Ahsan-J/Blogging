import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Log } from "./logging.entity";
import { ICreateLog } from "./logging.type";

@Injectable()
export class LoggingService {
    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>,
        ) {}

    async getLogs(options: FindManyOptions<Log>): Promise<[Log[], number]> {
        return await this.logRepository.findAndCount(options);
    }

    async createLog(log: ICreateLog): Promise<Log> {
        return await this.logRepository.save({
            message: log.message,
            data: log.data,
            file_path: log.file_path,
            route: log.route,
        })
    }
}