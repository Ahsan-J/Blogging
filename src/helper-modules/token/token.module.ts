import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/modules/auth/auth.module";
import { UserModule } from "src/modules/user/user.module";
import { RedisModule } from "../cache/cache.module";
import { CommonModule } from "../common/common.module";
import { TokenService } from "./token.service";

@Global()
@Module({
    imports: [
        ConfigModule,
        CommonModule,
        AuthModule,
        RedisModule,
        UserModule,
    ],
    providers: [TokenService],
    exports: [TokenService],
})
export class TokenModule { }