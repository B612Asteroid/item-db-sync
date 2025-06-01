// database.module.ts
import { Module } from "@nestjs/common";
import { SourceDataSourceProvider } from "@config/datasource/source.datasource";
import { SyncDataSourceProvider } from "@config/datasource/sync.datasource";

/**
 * 데이터베이스 연결 용 모듈
 */
@Module({
    providers: [SourceDataSourceProvider, SyncDataSourceProvider],
    exports: ["SOURCE_DATASOURCE", "SYNC_DATASOURCE"], // 다른 모듈에서 사용 가능하도록
})
export class DatabaseModule {}
