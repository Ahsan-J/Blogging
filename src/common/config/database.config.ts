import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm"

export const DatabaseConfiguration: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        "type": "mysql",
        "host": configService.get('DATABASE_HOST'),
        "port": parseInt(configService.get('DATABASE_PORT', "3306"), 10),
        "username": configService.get('DATABASE_USER'),
        "password": configService.get('DATABASE_PASS'),
        "database": configService.get('DATABASE_NAME'),
        "synchronize": true,
        "autoLoadEntities": true,
    }),
    inject: [ConfigService]
}