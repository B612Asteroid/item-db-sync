import { Entity } from "typeorm";
import { BaseItem } from "@app/item/base/item.base.entity";

/**
 * 목적지용 아이템
 */
@Entity()
export abstract class SyncItem extends BaseItem {}
