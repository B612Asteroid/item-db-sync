// src/app/item/source/item-source.entity.ts
import { Column, PrimaryColumn } from "typeorm";
import { Persistable } from "src/core/persistable";

/**
 * 예제 아이템 베이스
 */
export abstract class BaseItem extends Persistable {
    @PrimaryColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    deleteYn: string;

    @Column()
    useYn: string;
}
