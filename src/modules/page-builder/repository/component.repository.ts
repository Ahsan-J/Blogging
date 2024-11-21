import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Component } from "../entity/component.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ComponentRepository extends Repository<Component> {
    constructor( 
        @InjectRepository(Component)
        repository: Repository<Component>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
    
}