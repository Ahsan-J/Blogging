import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Version, VERSION_NEUTRAL } from "@nestjs/common";
import { Idempotent } from '@/common/decorator/idempotent.decorator';

@ApiTags('Index')
@Controller()
export class AppController {
    @Get()
    @Version(VERSION_NEUTRAL)
    async index() {
        return "It is working"
    }

    @Get('/test-cache')
    @Idempotent()
    async cacheTester() {
        await resolver();
        return {
            "cache": true
        }
    }
}

const resolver = () => new Promise((resolve) => {
    setTimeout(() => resolve(null), 5000);
})