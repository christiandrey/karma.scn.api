import { IJsonResponse } from "../interfaces/IJsonResponse";

export namespace Methods {

    // -------------------------------------------------------------------------------------------------
    /** Returns a jsonResponse Object */
    export function getJsonResponse<T>(data: T, message = "", status = true): IJsonResponse<T> {
        return {
            status,
            message,
            data
        } as IJsonResponse<T>;
    }
}