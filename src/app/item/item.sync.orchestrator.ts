import { Inject, Injectable, Logger } from "@nestjs/common";
import { ItemService } from "@app/item/item.service";
import { hourRangeQuery } from "src/utils/query-utils";
import { transactional } from "src/utils/transactional";
import { DataSource, EntityManager } from "typeorm";
import { FileService } from "@app/file/file.service";

/**
 * 아이템 싱크 용 예시 오케스트레이터
 * 주로 원본 DB에서 데이터를 검색하고, 목적지 DB에 적재한다.
 * 트랜잭션을 위해 Service를 가져오고 여기서, 엔티티매니저를 주입한다.
 */
@Injectable()
export class ItemSyncOrchestrator {
    private readonly logger = new Logger(ItemSyncOrchestrator.name);
    constructor(
        @Inject() private readonly itemService: ItemService,
        @Inject() private readonly fileService: FileService,
        @Inject("SYNC_DATASOURCE") private readonly syncDataSource: DataSource,
    ) {}

    /**
     * 마이그레이션 시작
     */
    async migrateAll(): Promise<boolean> {
        await transactional(this.syncDataSource, async (manager: EntityManager) => {
            this.logger.log("MIGRATE ITEMS START");
            const where = hourRangeQuery("updatedAt", 2);
            const sourceItems = await this.itemService.findItemsBy(where);
            await this.itemService.saveItems(manager, sourceItems);
            const itemThumbnails = await this.fileService.getFilesByReferences(sourceItems);
            await this.fileService.saveFiles(manager, itemThumbnails);
            this.logger.log("MIGRATE ITEMS END");

            this.logger.log("MIGRATE TOOLS START");
            const sourceTools = await this.itemService.findToolsBy(where);
            await this.itemService.saveTools(manager, sourceTools);
            this.logger.log("MIGRATE TOOLS END");

            this.logger.log("MIGRATE ITEM Tool LINK START");
            const itemIds = await this.itemService.findItemIdsByItemToolLink(where);
            const sourceItemTookLinks = await this.itemService.findItemToolLinksByItemIds(itemIds);

            await this.itemService.deleteItemToolLinkByItemIds(manager, itemIds);
            await this.itemService.saveItemToolLinks(manager, sourceItemTookLinks);
            this.logger.log("MIGRATE ITEM Tool LINK END");
        });

        return true;
    }

    /**
     * 아이디 하나를 받아 단건 마이그레이션을 진행한다.
     * @param itemId
     */
    async migrate(itemId: number) {
        // #. TODO 아이디 하나만 받아서 migrate 시작
    }
}
