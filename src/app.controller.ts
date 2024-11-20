import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Version, VERSION_NEUTRAL } from "@nestjs/common";

@ApiTags('Index')
@Controller()
export class AppController {
    @Get()
    @Version(VERSION_NEUTRAL)
    async index() {
        return "It is working"
    }
}
