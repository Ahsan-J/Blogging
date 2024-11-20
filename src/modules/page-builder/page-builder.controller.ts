import { AuthUser } from "@/common/decorator/auth.decorator";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "@/modules/user/user.entity";

@ApiTags('Page Builder')
@Controller()
export class PageBuilderController {
    @Get()
    async getAllPagesByUser(@AuthUser() user: User) {
        return user
    }
}
