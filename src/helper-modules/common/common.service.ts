import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PaginationMeta } from "./common.dto";

@Injectable()
export class CommonService {
    constructor(private configService: ConfigService) {}

    setValue(value: number, status: number): number {
        return value | status
    }

    checkValue(value: number, status: number): boolean {
        return (value & status) == status;
    }

    removeValue(value: number, status: number): number {
        return value & ~status
    }

    generateMeta(count: number, current_page: number, page_size: number): PaginationMeta | null {
        if(!page_size || !current_page || !count) return null;
        return {
            from: (current_page - 1) * page_size,
            to: current_page * page_size,
            total: count,
            current_page,
            last_page: Math.ceil(count / page_size),
            page_size,
        }
    }
}