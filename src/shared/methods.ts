import { IJsonResponse } from "../interfaces/IJsonResponse";
import { Validator } from "class-validator";
import { Response, Request } from "express";
import * as path from "path";
import { TimelinePost } from "../dto/classes/TimelinePost";
import { TimelinePostTypeEnum } from "../enums/TimelinePostTypeEnum";
import { TimelineUpdate } from "../entities/TimelineUpdate";
import { Comment } from "../entities/Comment";
import { Like } from "../entities/Like";
import { TimelinePhoto } from "../entities/TimelinePhoto";
import { Job } from "../entities/Job";
import { Webinar } from "../entities/Webinar";
import { Resource } from "../entities/Resource";
import { Article } from "../entities/Article";

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
		};

		resp.status(status).send(response);
	}

	// -------------------------------------------------------------------------------------------------
	/** Returns an integer hash based on a string */
	export function hash(text: string): number {
		var hash = 0,
			i,
			chr,
			len;
		if (text.length === 0) return hash;
		for (i = 0, len = text.length; i < len; i++) {
			chr = text.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
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
			.replace(/\s(.)/g, function($1) {
				return $1.toUpperCase();
			})
			.replace(/\s/g, "")
			.replace(/^(.)/, function($1) {
				return $1.toLowerCase();
			});
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

	// -------------------------------------------------------------------------------------------------
	/** Get mimetype from extension */
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

	// -------------------------------------------------------------------------------------------------
	/** Randomly selected a specified number of items from a list */
	export function randomlySelectFrom<T>(list: Array<T>, quantity: number): Array<T> {
		const shuffledList = shuffle(list);
		return shuffledList.slice(0, quantity);
	}

	// -------------------------------------------------------------------------------------------------
	/** Shuffle items in a list using the Fisher-Yates Shuffle Algorithm and returns a new list */
	export function shuffle<T>(list: Array<T>): Array<T> {
		let a = [...list];
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	// -------------------------------------------------------------------------------------------------
	/** Create a generic timeline post from given item */
	export function getTimelinePostFrom(item: any, type: TimelinePostTypeEnum): TimelinePost {
		const timelinePost = new TimelinePost({
			id: item["id"],
			createdDate: item["createdDate"],
			comments: !!item["comments"] ? item["comments"] : new Array<Comment>(),
			likes: !!item["likes"] ? item["likes"] : new Array<Like>(),
			type
		});

		if (!!item["publicationDate"]) {
			timelinePost.createdDate = item["publicationDate"];
		}

		if (type === TimelinePostTypeEnum.Default || type === TimelinePostTypeEnum.Announcement) {
			const toTransform = item as TimelineUpdate;
			const { author, content } = toTransform;
			timelinePost.author = author;
			timelinePost.content = content;
		}

		if (type === TimelinePostTypeEnum.Photo) {
			const toTransform = item as TimelinePhoto;
			const { author, media } = toTransform;
			timelinePost.imageUrl = media.url;
			timelinePost.author = author;
		}

		if (type === TimelinePostTypeEnum.Job) {
			const toTransform = item as Job;
			const { author, urlToken, title, description } = toTransform;
			timelinePost.content = title;
			timelinePost.extraContent = description;
			timelinePost.urlToken = urlToken;
			timelinePost.author = author;
		}

		if (type === TimelinePostTypeEnum.Webinar) {
			const toTransform = item as Webinar;
			const { author, urlToken, topic, description, startDateTime } = toTransform;
			timelinePost.content = topic;
			timelinePost.extraContent = description;
			timelinePost.urlToken = urlToken;
			timelinePost.author = author;
			timelinePost.extraDate = startDateTime;
		}

		if (type === TimelinePostTypeEnum.Resource) {
			const toTransform = item as Resource;
			const { user, purchaseUrl, title, description } = toTransform;
			timelinePost.content = title;
			timelinePost.extraContent = description;
			timelinePost.author = user;
			timelinePost.urlToken = purchaseUrl;
		}

		if (type === TimelinePostTypeEnum.Article) {
			const toTransform = item as Article;
			const { author, title, synopsis, featuredImage, urlToken } = toTransform;
			timelinePost.content = title;
			timelinePost.extraContent = synopsis;
			timelinePost.author = author;
			timelinePost.urlToken = urlToken;
			timelinePost.imageUrl = featuredImage.url;
		}

		return timelinePost;
	}

	// -------------------------------------------------------------------------------------------------
	/** Sort a given set of items by createdDate */
	export function sortByDate<T>(list: Array<T>, direction: "asc" | "desc" = "desc"): Array<T> {
		if (direction === "asc") {
			let sortedList = list.sort((a, b) => a["createdDate"].getTime() - b["createdDate"].getTime());
			return sortedList;
		} else {
			let sortedList = list.sort((a, b) => b["createdDate"].getTime() - a["createdDate"].getTime());
			return sortedList;
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Skip and Take */
	export function getPaginatedItems<T>(list: Array<T>, pageSize: number, page: number = 1): Array<T> {
		const index = pageSize * (page - 1);
		return list.slice(index, pageSize * page);
	}

	// -------------------------------------------------------------------------------------------------
	/** Remap properties in a target entity to those of a source entity if those properties have changed */
	export function remapIfChanged<T>(source: T, target: T, ...args: Array<string>): T {
		args.forEach(a => {
			let sourceProperty = getDescendantProp(source, a);
			let targetProperty = getDescendantProp(target, a);
			if (!!targetProperty && targetProperty !== sourceProperty) {
				setDescendantProp(source, a, targetProperty);
			}
		});
		return source;
	}

	// -------------------------------------------------------------------------------------------------
	/** Remap properties in a target entity to those of a source entity if those properties have changed */
	export function toSentenceCase(text: string): string {
		return `${text[0].toUpperCase()}${text[1].slice(1).toLowerCase()}`;
	}

	function getDescendantProp(source: any, property: string) {
		var arr = property.split(".");
		while (arr.length) {
			if (!!source) {
				source = source[arr.shift()];
			} else {
				return undefined;
			}
		}
		return source;
	}

	function setDescendantProp<T>(source: T, property: string, value: any): T {
		var arr = property.split(".");
		while (arr.length > 1) {
			source = source[arr.shift()];
		}
		return (source[arr[0]] = value);
	}
}
