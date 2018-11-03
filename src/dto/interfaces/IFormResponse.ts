export interface IFormResponse<T = {}> {
    isValid: boolean;
    errors: Array<any>;
    target?: T;
}