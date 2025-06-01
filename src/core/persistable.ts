import { Column } from "typeorm";

/**
 * 모든 엔티티 조상
 */
export abstract class Persistable {
    /* 컬럼명이 다 달라서 abstract */
    abstract id: number;

    @Column({ name: "SRC_CLS_NM" })
    className: string;

    @Column({ name: "CRTR_ID" })
    createdBy: string;

    @Column({ name: "MDFR_ID" })
    updatedBy: string;

    @Column({ name: "CRT_DTM" })
    createdAt: Date;

    @Column({ name: "MDF_DTM" })
    updatedAt: Date;
}
