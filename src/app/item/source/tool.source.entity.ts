import { ViewEntity } from "typeorm";
import { BaseTool } from "@app/item/base/tool.base.entity";

/**
 * 도구 테이블
 * 예제이기 때문에 최소화
 */
@ViewEntity()
export class SourceTool extends BaseTool {}
