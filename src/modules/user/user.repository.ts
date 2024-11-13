import { User } from "./user.entity";
import { Repository } from "typeorm";

export class UserRepository extends Repository<User> {};