import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Page } from "../entity/page.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PageRepository extends Repository<Page> {
    constructor( 
        @InjectRepository(Page)
        repository: Repository<Page>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }

}