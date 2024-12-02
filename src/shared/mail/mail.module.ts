import { DynamicModule, Global, Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import nodemailer from 'nodemailer';
import { NODEMAILER_TRANSPORTER } from "./mail.constant";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { NodemailerConfig } from "./mail.type";

@Global()
@Module({})
export class MailModule {
    static forRoot(config?: NodemailerConfig): DynamicModule {
        return {
            module: MailModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: NODEMAILER_TRANSPORTER,
                    useFactory: async (configService: ConfigService) => {
                        return nodemailer.createTransport({
                            host: getOrFallback(config?.host, configService.get("SMTP_HOST")),
                            port: getOrFallback(config?.port, configService.get("SMTP_PORT")),
                            secure: true,
                            auth: {
                                user: getOrFallback(config?.user, configService.get("SMTP_USER")),
                                pass: getOrFallback(config?.pass, configService.get("SMTP_PASSWORD")),
                            }
                        });
                    },
                    inject: [ConfigService]
                },
                MailService,
            ],
            exports: [MailService],
        };
    }

}

function getOrFallback<T extends (string | number)>(value?: T | null, fallback?: T): T {
    const fallbackValue = typeof fallback === 'string' ? (fallback || "" as T) : (fallback || 0 as T);
    return typeof value == "undefined" || value == null ? fallbackValue : value;
}