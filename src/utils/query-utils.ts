import { Between, FindOptionsWhere } from "typeorm";
import dayjs from "dayjs";

/**
 * 현재시간으로부터 시간값을 뺀 from to Query를 조립해 가져온다.
 *
 * @param column
 * @param hours
 */
export function hourRangeQuery<T>(column: keyof T, hours: number = 2): FindOptionsWhere<T> {
    const from = dayjs().subtract(hours, "hour").toDate();
    const to = dayjs().toDate();
    return { [column]: Between(from, to) } as FindOptionsWhere<T>;
}
