import { Column, PrimaryColumn } from "typeorm";
import { Persistable } from "src/core/persistable";

/**
 * 도구 테이블
 * 예제이기 때문에 최소화
 */
export abstract class BaseTool extends Persistable {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;
}
