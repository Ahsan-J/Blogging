import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from "@nestjs/common";

@ApiTags('Index')
@Controller()
export class AppController {
    @Get()
    async index() {
        return "It is working"
    }
}

