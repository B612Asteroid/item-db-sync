import { loggerConfig } from "@config/logger/logger.config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { ItemModule } from "@app/item/item.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SyncSchedulerModule } from "src/scheduler/sync.scheduler.module";
import { FileModule } from "@app/file/file.module";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
        }),
        LoggerModule.forRootAsync(loggerConfig),
        ItemModule,
        SyncSchedulerModule,
        FileModule,
        // 앞으로 추가될 모듈들
    ],
})
export class AppModule {}
