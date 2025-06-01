import { SyncScheduler } from "src/scheduler/sync.scheduler";
import { Module } from "@nestjs/common";
import { ItemModule } from "@app/item/item.module";
import { FileModule } from "@app/file/file.module";

@Module({
    providers: [SyncScheduler],
    imports: [ItemModule, FileModule],
})
export class SyncSchedulerModule {}
