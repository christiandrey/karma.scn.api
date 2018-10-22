import { IFormResponse } from "../interfaces/IFormResponse";

export class FormResponse<T> implements IFormResponse<T> {
    isValid: boolean;
    errors: Array<string>;
    target?: T;

    constructor(dto?: IFormResponse<T> | any) {

        dto = dto || {} as IFormResponse<T>;

        this.isValid = dto.isValid;
        this.errors = dto.errors ? dto.errors : new Array<string>();
        this.target = dto.target;
    }
}