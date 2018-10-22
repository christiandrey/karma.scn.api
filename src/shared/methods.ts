import { IJsonResponse } from "../interfaces/IJsonResponse";
import { Validator } from "class-validator";

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

    // -------------------------------------------------------------------------------------------------
    /** Returns an integer hash based on a string */
    export function hash(text: string): number {
        var hash = 0, i, chr, len;
        if (text.length === 0) return hash;
        for (i = 0, len = text.length; i < len; i++) {
            chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    // -------------------------------------------------------------------------------------------------
    /** Validates an email address */
    export async function validateEmail(email: string): Promise<boolean> {
        const validator = new Validator();
        return await validator.isEmail(email);
    }
}