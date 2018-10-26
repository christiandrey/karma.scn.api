import { IJsonResponse } from "../interfaces/IJsonResponse";
import { Validator } from "class-validator";
import { Response, Request } from "express";
import * as path from "path";

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

        resp.status(status).send(response);
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

    // -------------------------------------------------------------------------------------------------
    /** Get file extension */
    export function getExtension(name: string): string {
        if (!!name) {
            const length = name.length;
            const index = name.lastIndexOf(".");
            return name.substr(index, length - 1);
        }
        return undefined;
    }

    // -------------------------------------------------------------------------------------------------
    /** Get application Host Name */
    export function getAppHostName(req: Request): string {
        return `${req.protocol}://${req.headers.host}`;
    }

    // -------------------------------------------------------------------------------------------------
    /** Get Base Folder Path */
    export function getBaseFolder(): string {
        return path.dirname(require.main.filename);
    }

    // -------------------------------------------------------------------------------------------------
    /** Asynchronous foreach */
    export async function forEachAsync<T>(list: Array<T>, callback: (item: T, index?: number) => void): Promise<void> {
        await Promise.all(list.map((item, index) => callback(item, index)));
    }

    // -------------------------------------------------------------------------------------------------
    /** Asynchronous foreach sequentially */
    export async function forEachSequentialAsync<T>(list: Array<T>, callback: (item: T, index?: number) => void): Promise<void> {
        for (let index = 0; index < list.length; index++) {
            await callback(list[index], index);
        }
    }

    export function getMimeTypeFromExtension(extension: string): string {
        switch (extension) {
            case ".jpeg":
                return "image/jpeg";
            case ".jpg":
                return "image/jpeg";
            case ".bmp":
                return "image/bmp";
            case ".png":
                return "image/png";
            case "pdf":
                return "application/pdf";
            default:
                return undefined;
        }
    }
}