import { AuthUser } from "@/common/decorator/auth.decorator";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "@/modules/user/user.entity";
import { PageBuilderService } from "./page-builder.service";
import { RegisterComponentRequest } from "./dto/register-component.dto";
import { ComponentResponse } from "./dto/component-response.dto";
import { PageResponse } from "./dto/page-response.dto";

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

    @Get(':id')
    async getPageById(@Param("id") id: string): Promise<PageResponse> {
        return this.pageBuilderService.getPageById(id);
    }

    @Post('register/component')
    async registerComponent(@Body() registerComponentRequest: RegisterComponentRequest): Promise<ComponentResponse> {
        return this.pageBuilderService.registerComponent(registerComponentRequest)
    }
}
