import { Contacts } from "./contact.entity";;
import { Repository } from "typeorm";

export class ContactRepository extends Repository<Contacts> {};