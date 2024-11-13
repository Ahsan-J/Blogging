import { nanoid } from "nanoid";
import { DataSource } from "typeorm";
import { User } from "../../modules/user/user.entity";
import { UserRole, UserStatus } from "../../modules/user/user.enum";

const users: Array<Partial<User>> = [
    {
        email: 'admin@admin.com',
        linkedin: '',
        name: 'Admin',
        profile: '',
        password: "49220c04e202c0a7c454e885f172221b6d54ef733bc33a604aa37e2e8207d829", // text: "password"
        role: UserRole.Admin,
        status: UserStatus.Active,
    }
]

export const entities = [User]

export function seed(AppDataSource: DataSource) {
    const userRepository = AppDataSource.getRepository(User);

    users.forEach(async (user: User) => {
        const savedUser = await userRepository.save({
            id: nanoid(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            ...user
        });
        console.log(`Creating new user: ${savedUser.id}`);
    })
}