import { BaseFile } from "@app/file/base/file.base.entity";
import { Entity } from "typeorm";

@Entity("file")
export class SyncFile extends BaseFile {}
