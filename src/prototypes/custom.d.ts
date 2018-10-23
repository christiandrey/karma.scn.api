interface IGrouping<T> {
    key: string;
    group: Array<T>;
}

interface Array<T> {
    contains(item: T): boolean;
    containsAll(array: Array<T>): boolean;
    containsAny(array: Array<T>): boolean;
    mapMany<T1>(expression: (item: T) => Array<T1>): Array<T1>;
    sum(expression: (item: T) => number): number;
    orderBy(expression: (item: T) => any): any[];
    orderByDescending(expression: (item: T) => any): any[];
    groupBy<T>(expression: (item: T) => string): Array<IGrouping<T>>;
    distinct(): Array<T>;
    distinctMerge(array: Array<T>): Array<T>;
}

interface String {
    includesSubstring(substring: string, ignoreCase?: boolean): boolean;
    replaceAll(search: string, replacement: string): string;
    isEmailAddress(): boolean;
    isNullOrEmpty(): boolean;
    replaceLast(search: string, replacement: string): string;
    leftPad(padString: string, length: number): string;
}

interface Number {
    toRadians(): number;
}

interface Date {
    addHours(hour: number): Date;
    getHourDifference(date: Date): number;
}