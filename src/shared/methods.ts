import { IJsonResponse } from "../interfaces/IJsonResponse";
import { Validator } from "class-validator";
import { Response } from "express";

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
    /** Creates an error response and sends it to the client */
    export function sendErrorResponse(resp: Response, status: number, message = ""): void {
        const response = {
            status: false,
            message,
            errors: [message]
        }

        resp.status(status).send(resp.json(response));
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

    // -------------------------------------------------------------------------------------------------
    /** Converts any string to camelCase */
    export function toCamelCase(text: string): string {
        return text
            .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
            .replace(/\s/g, '')
            .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
    }

    // -------------------------------------------------------------------------------------------------
    /** Checks if a string contains a substring */
    export function includesSubstring(text: string, substring: string, ignoreCase = false): boolean {
        var origin = text;
        if (ignoreCase) {
            origin = origin.toLowerCase();
            substring = substring.toLowerCase();
        }
        return origin.indexOf(substring) !== -1;
    }
}