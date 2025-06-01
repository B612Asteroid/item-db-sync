import { DataSource, EntityManager } from "typeorm";

/**
 * 트랜잭션 단위로 주어진 작업을 수행한다.
 * 내부에서 queryRunner를 생성 및 종료하고, commit/rollback을 처리한다.
 *
 * @param dataSource 사용할 DataSource
 * @param work 트랜잭션 내에서 실행할 작업 (EntityManager를 인자로 받음)
 */
export async function transactional<T = any>(
    dataSource: DataSource,
    work: (manager: EntityManager) => Promise<T>,
): Promise<T> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const result = await work(queryRunner.manager);
        await queryRunner.commitTransaction();
        return result;
    } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
    } finally {
        await queryRunner.release();
    }
}
