import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
   const { user } = ctx.switchToHttp().getRequest().session;
   return data ? user?.[data] : user;
});