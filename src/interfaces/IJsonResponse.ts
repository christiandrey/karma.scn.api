export interface IJsonResponse<T> {
    status: boolean;
    message: string;
    data: T;
}