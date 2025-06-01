import { Column, PrimaryColumn } from "typeorm";
import { Persistable } from "src/core/persistable";

/**
 * 아이템 - 도구 매핑 테이블
 * JoinColumn 이 아닌 ID로 매핑하는 이유는 마이그레이션 용 단건 테이블 조회가 주 이며, Join 할일이 거의 없기 떄문
 */
export abstract class BaseItemToolLink extends Persistable {
    @PrimaryColumn()
    id: number;

    @Column()
    itemId: number;

    @Column()
    toolId: number;

    @Column({ nullable: true })
    customAlias?: string;
}
