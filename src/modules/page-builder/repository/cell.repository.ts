import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Cell } from "../entity/cell.entity";

@Injectable()
export class CellRepository extends Repository<Cell> {
    constructor( 
        @InjectRepository(Cell)
        repository: Repository<Cell>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
    
}