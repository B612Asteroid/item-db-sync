import { Controller, Inject, Logger, Param, Post } from "@nestjs/common";
import { ItemSyncOrchestrator } from "@app/item/item.sync.orchestrator";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

/**
 * 트리거 용 컨트롤러.
 *
 */
@ApiTags("아이템 컨트롤러")
@Controller("item")
export class ItemController {
    private readonly logger = new Logger(ItemController.name);

    constructor(@Inject() private readonly itemSyncOrchestrator: ItemSyncOrchestrator) {}

    @Post("migrate/:itemId")
    @ApiOperation({ summary: "아이템 단건 마이그레이션" })
    @ApiParam({ name: "itemId", type: Number })
    async migrateItem(@Param("itemId") itemId: number) {
        this.logger.log("POST /items/migrate/:itemId 호출됨");
        await this.itemSyncOrchestrator.migrate(itemId);
    }
}
