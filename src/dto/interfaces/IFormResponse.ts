export interface IFormResponse<T> {
    isValid: boolean;
    errors: Array<string>;
    target?: T;
}