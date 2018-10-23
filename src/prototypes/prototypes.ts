// -----------------------------------------------------------------
// PROTOTYPES
// -----------------------------------------------------------------

Date.prototype.addHours = function (hours: number): Date {
    var origin = this;
    origin.setTime(this.getTime() + (hours * 60 * 60 * 1000));
    return origin;
}

Date.prototype.getHourDifference = function (target: Date): number {
    var origin = this as Date;
    var originMilliseconds = origin.getTime();
    var targetMilliseconds = target.getTime();
    return (targetMilliseconds - originMilliseconds) / (60 * 60 * 1000);
}

Number.prototype.toRadians = function (): number {
    return this * (Math.PI / 180);
}

String.prototype.includesSubstring = function (substring: string, ignoreCase = false) {
    var origin = this;
    if (ignoreCase) {
        origin = origin.toLowerCase();
        substring = substring.toLowerCase();
    }
    return origin.indexOf(substring) !== -1;
}

String.prototype.replaceAll = function (search: string, replacement: string) {
    // escape 'search' parameter
    search = search.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.isEmailAddress = function (): boolean {
    var target = this;
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(target.toLowerCase());
}

String.prototype.isNullOrEmpty = function (): boolean {
    var target = this;
    if (!target) return true;
    if (target == null) return true;
    if (target == "undefined") return true;
    if (target.length === 0) return true;
    return false;
}

String.prototype.replaceLast = function (search: string, replacement: string): string {
    var target = this;
    var targetArray = target.split("");
    var lastIndex = target.lastIndexOf(search);
    if (lastIndex > -1) {
        targetArray[lastIndex] = replacement;
        return targetArray.join("");
    }
    return target;
}

String.prototype.leftPad = function (padString: string, length: number): string {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

interface IGrouping<T> {
    key: string;
    group: Array<T>;
}

Array.prototype.contains = function <T>(item: T): boolean {
    return this.indexOf(item) > -1;
}

Array.prototype.containsAny = function <T>(array: Array<T>): boolean {
    return this.some(x => array.some(y => y === x));
}

Array.prototype.containsAll = function <T>(array: Array<T>): boolean {
    return array.every(x => this.some(y => y === x));
}

Array.prototype.mapMany = function <T, T1>(expression: (x: T) => Array<T1>): Array<T1> {
    return this.map(expression).reduce((a, b) => a.concat(b), []);
}

Array.prototype.sum = function <T>(expression: (item: T) => number): number {
    return this.map(expression).reduce((a, b) => a + b, 0);
}

Array.prototype.orderBy = function (expression: (item: any) => any) {
    const result = [];
    const compareFunction = (item1: any, item2: any): number => {
        if (expression(item1) > expression(item2)) return 1;
        if (expression(item2) > expression(item1)) return -1;
        return 0;
    };
    for (const i = 0; i < (this as Array<any>).length;) {
        return (this as Array<any>).sort(compareFunction);
    }
    return result;
}

Array.prototype.orderByDescending = function (expression: (item: any) => any) {
    const result = [];
    const compareFunction = (item1: any, item2: any): number => {
        if (expression(item1) > expression(item2)) return -1;
        if (expression(item2) > expression(item1)) return 1;
        return 0;
    };
    for (const i = 0; i < (this as Array<any>).length;) {
        return (this as Array<any>).sort(compareFunction);
    }
    return result;
}

Array.prototype.groupBy = function <T>(expression: (item: T) => string) {
    var groups = [] as Array<IGrouping<T>>;
    this.forEach(function (element) {
        var key = expression(element);
        groups[key].push(element);
    });
    return Object.keys(groups).map(key => {
        return {
            key: key,
            group: groups[key]
        } as IGrouping<T>;
    });
};

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

Array.prototype.distinct = function <T>() {
    return this.filter(unique);
};

Array.prototype.distinctMerge = function <T>(array: Array<T>): Array<T> {
    var mergedArray = new Array<T>();
    this.concat(array).forEach(item => {
        mergedArray.indexOf(item) === -1 && mergedArray.push(item);
    });
    return mergedArray;
}