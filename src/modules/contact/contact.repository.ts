import { InjectRepository } from "@nestjs/typeorm";
import { Contacts } from "./contact.entity";;
import { Repository } from "typeorm";

export class ContactRepository extends Repository<Contacts> {
  constructor(
    @InjectRepository(Contacts)
    repository: Repository<Contacts>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
};