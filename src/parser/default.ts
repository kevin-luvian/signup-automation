
export type RowParser<T = object> = (row: object) => T;
export function defaultParser<T = object>(row: object): T {
    return row as T;
}
