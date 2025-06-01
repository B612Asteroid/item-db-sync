import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Persistable } from "src/core/persistable";

/**
 * 업로드 파일 베이스 Entity
 * referenceId + className(Persistable)로 각 객체에 연결된 파일을 가져올 수 있음.
 */
export abstract class BaseFile extends Persistable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    referenceId: number;

    @Column()
    originFilePath: string;

    @Column()
    filePath: string;

    @Column()
    fileType: string;

    @Column()
    altText: string;

    @Column()
    deleteYn: string;
}
