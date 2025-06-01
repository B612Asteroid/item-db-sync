import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { DatabaseModule } from "src/core/database.module";
import { ItemSyncOrchestrator } from "./item.sync.orchestrator";
import { FileModule } from "@app/file/file.module";

@Module({
    controllers: [ItemController],
    providers: [ItemService, ItemSyncOrchestrator],
    exports: [ItemSyncOrchestrator, ItemService],
    imports: [DatabaseModule, FileModule],
})
export class ItemModule {}
