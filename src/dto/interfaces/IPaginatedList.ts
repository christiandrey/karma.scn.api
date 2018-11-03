export interface IPaginatedList<T> {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    items: Array<T>;
}