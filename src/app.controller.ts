import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Render, Version, VERSION_NEUTRAL } from "@nestjs/common";
import { Idempotent } from '@/common/decorator/idempotent.decorator';
import { differenceInSeconds } from 'date-fns';

const uptime = new Date();

@ApiTags('Index')
@Controller()
export class AppController {
    @Get()
    @Render('index')
    @Version(VERSION_NEUTRAL)
    async index() {
        const uptimeSeconds = differenceInSeconds(new Date(), uptime);
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = Math.floor(uptimeSeconds % 60);

        return {text: `[${process.pid}] System uptime: ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
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