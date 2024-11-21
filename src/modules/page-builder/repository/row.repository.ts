import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Row } from "../entity/row.entity";

@Injectable()
export class RowRepository extends Repository<Row> {
    constructor( 
        @InjectRepository(Row)
        repository: Repository<Row>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
    
}