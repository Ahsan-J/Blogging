import { User } from "@/modules/user/user.entity";
import { Injectable, Logger } from "@nestjs/common";
import { DataSeeder } from "@/common/interface/seeder.interface";
import { UserRepository } from "@/modules/user/user.repository";
import { nanoid } from "nanoid";

const users: Array<Partial<User>> = [
    {
        "id": "GovsHS03z-oJTzX9ZMZXb",
        "email": "ahsan@yopmail.com",
        "linkedin": "",
        "name": "Ahsan Ahmed",
        "profile": "",
        "password": "49220c04e202c0a7c454e885f172221b6d54ef733bc33a604aa37e2e8207d829",
        "role": 0
    }
]

@Injectable()
export class UserDataSeeder implements DataSeeder<User> {

    private logger = new Logger(UserDataSeeder.name)

    constructor(
        private userRepository: UserRepository,
    ) { }

    async seed(dataSet: Partial<User>[] = users) {
        for (const partialUser of dataSet) {
            if (!await this.userRepository.findOne({ where: { id: partialUser.id } })) {
                this.logger.log(`Adding user ${partialUser.id}`)
                await this.userRepository.save(this.createUser(partialUser))
            }
        }
    }

    private createUser(data: Partial<User>): User {
        const user = new User();

        user.id = data.id || nanoid();
        user.name = data.name || "";
        user.email = data.email || "";
        user.linkedin = data.linkedin || "";
        user.profile = data.profile || "";
        user.password = data.password || "";
        user.isActive = true;
        user.bio = data.bio || "";
        user.role = data.role || 0;
        user.github = data.github || "";

        return user;
    }
}