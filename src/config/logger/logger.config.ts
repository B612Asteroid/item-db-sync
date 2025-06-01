// src/config/logger.config.ts
import { LoggerModuleAsyncParams } from "nestjs-pino";

export const loggerConfig: LoggerModuleAsyncParams = {
    useFactory: () => ({
        pinoHttp: {
            level: "warn",
            transport:
                process.env.NODE_ENV !== "production"
                    ? {
                          target: "pino-pretty",
                          options: { colorize: true },
                      }
                    : undefined,
        },
    }),
};
