import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<User> {

  constructor(
    @InjectRepository(User)
    repository: Repository<User>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findUserById(id: string) {
    if (!id) {
      throw new BadRequestException(`"id" is needed to fetch define. got ${id}`)
    }

    const user = await this.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`No User found for the id ${id}`)
    }

    return user;
  }

  async findUserByEmail(email: User['email']): Promise<User> {
    if (!email) {
      throw new BadRequestException(`User's "email" is not definded`)
    }

    const user = await this.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No User found for the email ${email}`)
    }

    return user;
  }
  
};