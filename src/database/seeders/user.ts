import { nanoid } from "nanoid";
import { DataSource } from "typeorm";
import { User } from "@/modules/user/user.entity";
import { UserRole } from "@/modules/user/user.enum";
import { Logger } from "@nestjs/common";
import { BitwiseOperator } from "@/common/utils/bitwise.utility";

// const userStatusBitwiseOperator = new BitwiseOperator(UserStatus)
const userRoleBitwiseOperator = new BitwiseOperator(UserRole)

const users: Array<Partial<User>> = [
    {
        email: 'admin@admin.com',
        linkedin: '',
        name: 'Admin',
        profile: '',
        password: "49220c04e202c0a7c454e885f172221b6d54ef733bc33a604aa37e2e8207d829", // text: "password"
        role: userRoleBitwiseOperator.setValue(0, UserRole.ADMIN),
        // status: userStatusBitwiseOperator.setValue(0,UserStatus.ACTIVE),
    }
]

export const entities = [User]

export function seed(AppDataSource: DataSource) {
    const logger = new Logger()
    const userRepository = AppDataSource.getRepository(User);

    users.forEach(async (user: User) => {
        const savedUser = await userRepository.save({
            ...user,
            id: nanoid(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
        });
        
        logger.log(`Creating new user: ${savedUser.id}`);
    })
}