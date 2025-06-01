import { Inject, Injectable, Logger } from "@nestjs/common";
import { DataSource, EntityManager, FindOptionsWhere, In } from "typeorm";
import { SourceItem } from "@app/item/source/item.source.entity";
import { SyncItemToolLink } from "@app/item/sync/item-tool-link.sync.entity";
import { SourceItemToolLink } from "@app/item/source/item-tool-link.source.entity";
import { SyncItem } from "@app/item/sync/item.sync.entity";
import { SourceTool } from "@app/item/source/tool.source.entity";
import { SyncTool } from "@app/item/sync/tool.sync.entity";

/**
 * 아이템 CRUD 서비스
 */
@Injectable()
export class ItemService {
    private readonly logger: Logger = new Logger(ItemService.name);
    constructor(
        @Inject("SOURCE_DATASOURCE")
        private readonly sourceDataSource: DataSource,

        @Inject("SYNC_DATASOURCE")
        private readonly syncDataSource: DataSource,
    ) {}

    /**
     * where 기반으로 Items 를 가져온다.
     * @param where
     */
    async findItemsBy(where: FindOptionsWhere<SourceItem>): Promise<SourceItem[]> {
        const sourceItemRepository = this.sourceDataSource.getRepository(SourceItem);
        return await sourceItemRepository.find({ where });
    }

    /**
     * 원본 아이템으로부터 목적지 아이템 복사
     * @param manager
     * @param items
     */
    async saveItems(manager: EntityManager, items: SourceItem[]): Promise<SyncItem[]> {
        const syncItemRepository = manager.getRepository(SyncItem);
        return await syncItemRepository.save(items);
    }

    /////// Tool /////

    /**
     * where 기반으로 Tools 를 가져온다.
     * @param where
     */
    async findToolsBy(where: FindOptionsWhere<SourceTool>): Promise<SourceTool[]> {
        const sourceToolRepository = this.sourceDataSource.getRepository(SourceTool);
        return await sourceToolRepository.find({ where });
    }

    /**
     * 원본 Tool으로부터 목적지 Tool 복사
     * @param manager
     * @param items
     */
    async saveTools(manager: EntityManager, tools: SourceTool[]): Promise<SyncTool[]> {
        const syncItemRepository = manager.getRepository(SyncTool);
        return await syncItemRepository.save(tools);
    }

    ///////// ItemToolLink //////

    /**
     * 연결된 아이템 아이디들을 가져온다.
     * @param where
     */
    async findItemIdsByItemToolLink(
        where: FindOptionsWhere<SourceItemToolLink>,
    ): Promise<number[]> {
        const toolLinkRepository = this.sourceDataSource.getRepository(SourceItemToolLink);
        return (await toolLinkRepository.find({ where, select: { itemId: true } })).map(
            ({ itemId }) => itemId,
        );
    }

    /**
     * 아이템 아이디에 걸린 원본 Link들을 가져온다.
     * @param itemIds
     */
    async findItemToolLinksByItemIds(itemIds: number[]) {
        const toolLinkRepository = this.sourceDataSource.getRepository(SourceItemToolLink);
        return await toolLinkRepository.find({ where: { itemId: In(itemIds) } });
    }

    /**
     * 아이템 아이디 기반으로 item-tool-link를 삭제한다.
     * @param manager
     * @param itemIds
     */
    async deleteItemToolLinkByItemIds(manager: EntityManager, itemIds: number[]): Promise<void> {
        const learningViewToolLinkRepository = manager.getRepository(SyncItemToolLink);
        await learningViewToolLinkRepository.delete({ itemId: In(itemIds) });
    }

    /**
     * 아이템 - 도구 매핑 데이터를 적재한다.
     * @param manager
     * @param itemToolLinks
     */
    async saveItemToolLinks(
        manager: EntityManager,
        itemToolLinks: SourceItemToolLink[],
    ): Promise<SyncItemToolLink[]> {
        const toolLinkRepository = manager.getRepository(SyncItemToolLink);
        return await toolLinkRepository.save(itemToolLinks);
    }
}
