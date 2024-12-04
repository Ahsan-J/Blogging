import { UserRole } from "@/modules/user/user.enum";
import { SetMetadata } from "@nestjs/common";

export const UseRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
