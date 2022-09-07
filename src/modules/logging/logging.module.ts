import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { LoggingController } from "./logging.controller";
import { Log } from "./logging.entity";
import { LoggingService } from "./logging.service";

const databaseConfiguration: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      "type": "sqlite",
      "database":  configService.get("LOGGING_DB") || `logging.db`,
      "synchronize": true,
      "entities":[Log],
    }),
    inject: [ConfigService]
  }

@Global()
@Module({
    controllers: [LoggingController],
    imports: [
        TypeOrmModule.forRootAsync(databaseConfiguration),
        TypeOrmModule.forFeature([Log]),
    ],
    providers: [LoggingService],
    exports: [LoggingService],
})
export class LoggingModule {}