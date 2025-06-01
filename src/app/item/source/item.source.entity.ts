import { BaseItem } from "@app/item/base/item.base.entity";
import { ViewEntity } from "typeorm";

/**
 * 원본 아이템(View)
 */
@ViewEntity()
export class SourceItem extends BaseItem {}
