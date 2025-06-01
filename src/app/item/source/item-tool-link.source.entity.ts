import { ViewEntity } from "typeorm";
import { BaseItemToolLink } from "@app/item/base/item-tool-link.base.entity";

/**
 * Item-Tool 링크 원본 테이블
 */
@ViewEntity()
export class SourceItemToolLink extends BaseItemToolLink {}
