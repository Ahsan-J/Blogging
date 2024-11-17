import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
   return ctx.switchToHttp().getRequest().user;
});