import { AuthUser } from "@/common/decorator/auth.decorator";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "@/modules/user/user.entity";
import { PageBuilderService } from "./page-builder.service";
import { ComponentResponse, RegisterComponentRequest } from "./dto/register-component.dto";

@ApiTags('Page Builder')
@Controller('page-builder')
export class PageBuilderController {

    constructor(
        private pageBuilderService: PageBuilderService,
    ) {}
    
    @Get()
    async getAllPagesByUser(@AuthUser() user: User) {
        return user
    }

    @Post('register/component')
    async registerComponent(@Body() registerComponentRequest: RegisterComponentRequest): Promise<ComponentResponse> {
        return this.pageBuilderService.registerComponent(registerComponentRequest)
    }
}
