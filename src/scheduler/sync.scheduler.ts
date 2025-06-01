import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ItemSyncOrchestrator } from "@app/item/item.sync.orchestrator";

/**
 * 스케쥴러
 * 매 시간마다 전체 마이그레이션을 호출
 * 특정 데이터만 마이그레이션 하고 싶으면 @Cron 추가
 */
@Injectable()
export class SyncScheduler {
    private readonly logger = new Logger(SyncScheduler.name);

    constructor(@Inject() private readonly itemSyncOrchestrator: ItemSyncOrchestrator) {}
    @Cron(CronExpression.EVERY_HOUR)
    async handleSyncJob() {
        this.logger.log("🛠️ [CRON] 데이터 싱크 시작");
        try {
            this.logger.log("🛠️ [CRON] 아이템 마이그레이션 시작");
            await this.itemSyncOrchestrator.migrateAll();
            this.logger.log("🛠️ [CRON] 아이템 마이그레이션 끝");

            // #. TODO 다른거 시작
            // #. 다른거 끝
        } catch (e) {
            this.logger.error("❌ 데이터 싱크 중 에러 발생", e);
        }
    }
}
