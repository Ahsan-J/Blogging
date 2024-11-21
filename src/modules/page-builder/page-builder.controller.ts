import { AuthUser } from "@/common/decorator/auth.decorator";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiParam, ApiTags } from "@nestjs/swagger";
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

    @Get(':name')
    @ApiParam({ name: 'name', required: true, type: String, description: 'Page fetching by alias' })
    async getPageByPageAlias(@Param("name") name: string): Promise<PageResponse> {
        return this.pageBuilderService.getPageByPageAlias(name);
    }

    @Post('register/component')
    async registerComponent(@Body() registerComponentRequest: RegisterComponentRequest): Promise<ComponentResponse> {
        return this.pageBuilderService.registerComponent(registerComponentRequest)
    }
}
