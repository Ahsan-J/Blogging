import { User } from "@/modules/user/user.entity";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const getAuthUser = <K extends keyof User>(data?: K, ctx?: ExecutionContext): User | User[K] => {
   const user: User = ctx?.switchToHttp().getRequest().user;
   return data ? user?.[data] : user;
}

export const AuthUser = createParamDecorator(getAuthUser);