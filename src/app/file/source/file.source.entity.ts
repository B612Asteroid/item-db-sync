import { BaseFile } from "@app/file/base/file.base.entity";
import { ViewEntity } from "typeorm";

@ViewEntity("file")
export class SourceFile extends BaseFile {}
