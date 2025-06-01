import { Entity } from "typeorm";
import { BaseTool } from "@app/item/base/tool.base.entity";

/**
 * 도구 목적지 엔티티
 */
@Entity()
export class SyncTool extends BaseTool {}
