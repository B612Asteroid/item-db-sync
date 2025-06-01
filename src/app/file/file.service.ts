import { Inject, Injectable, Logger } from "@nestjs/common";
import { DataSource, EntityManager, Equal, In } from "typeorm";
import { Persistable } from "src/core/persistable";
import { SourceFile } from "@app/file/source/file.source.entity";
import { SyncFile } from "@app/file/sync/file.sync.entity";

/**
 * 파일 CRUD 서비스
 */
@Injectable()
export class FileService {
    private readonly logger: Logger = new Logger(FileService.name);

    constructor(
        @Inject("SOURCE_DATASOURCE")
        private readonly sourceDataSource: DataSource,

        @Inject("SYNC_DATASOURCE")
        private readonly syncDataSource: DataSource,
    ) {}

    /**
     * 객체 연결 Files를 가져온다.
     * @param persistables
     */
    async getFilesByReferences(persistables: Persistable[]): Promise<SourceFile[]> {
        if (!persistables || !persistables.length) {
            return [];
        }
        const ids = persistables.map(({ id }) => id);
        const className = persistables[0].className;
        const sourceFileRepository = this.sourceDataSource.getRepository(SourceFile);
        return await sourceFileRepository.find({
            where: { id: In(ids), className: Equal(className) },
        });
    }

    /**
     * 첨부파일을 벌크로 저장한다.
     * @param manager
     * @param files
     */
    async saveFiles(manager: EntityManager, files: SourceFile[]): Promise<SyncFile[]> {
        const syncFileRepository = manager.getRepository(SyncFile);
        if (!files || !files.length) {
            return [];
        }
        return await syncFileRepository.save(files);
    }
}
