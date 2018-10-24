import { Article } from "../entities/Article";
import { User } from "../entities/User";
import { Media } from "../entities/Media";
import { MapComment } from "./mapComment";

export namespace MapArticle {

    export function inArticlesControllerGetLatestAsync(article: Article): Article {
        const { id, author, title, urlToken, featuredImage, synopsis } = article;

        return {
            id, title, urlToken, synopsis,
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                urlToken: author.urlToken
            } as User,
            featuredImage: {
                id: featuredImage.id,
                url: featuredImage.url
            } as Media
        } as Article;
    }

    export function inArticlesControllerGetAll(article: Article): Article {
        const { id, author, title, urlToken, featuredImage, synopsis } = article;

        return {
            id, title, urlToken, synopsis,
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                urlToken: author.urlToken
            } as User,
            featuredImage: {
                id: featuredImage.id,
                url: featuredImage.url
            } as Media
        } as Article;
    }

    export function inArticlesControllerGetByUrlToken(article: Article): Article {
        const { id, author, title, body, urlToken, featuredImage, synopsis, comments } = article;

        return {
            id, title, urlToken, synopsis, body,
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                urlToken: author.urlToken
            } as User,
            featuredImage: {
                id: featuredImage.id,
                url: featuredImage.url
            } as Media,
            comments: comments.map(c => MapComment.inAllControllers(c))
        } as Article;
    }

    export function inArticlesControllerCreateAsync(article: Article): Article {
        const { id, author, title, urlToken, featuredImage, synopsis } = article;

        return {
            id, title, urlToken, synopsis,
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                urlToken: author.urlToken
            } as User,
            featuredImage: {
                id: featuredImage.id,
                url: featuredImage.url
            } as Media
        } as Article;
    }

    export function inArticlesControllerUpdateAsync(article: Article): Article {
        const { id, author, title, urlToken, featuredImage, synopsis } = article;

        return {
            id, title, urlToken, synopsis,
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                urlToken: author.urlToken
            } as User,
            featuredImage: {
                id: featuredImage.id,
                url: featuredImage.url
            } as Media
        } as Article;
    }

    export function inArticlesControllerPublishAsync(article: Article): Article {
        const { id, author, title, urlToken, featuredImage, synopsis } = article;

        return {
            id, title, urlToken, synopsis,
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                urlToken: author.urlToken
            } as User,
            featuredImage: {
                id: featuredImage.id,
                url: featuredImage.url
            } as Media
        } as Article;
    }

    export function inArticlesControllerUnPublishAsync(article: Article): Article {
        const { id, author, title, urlToken, featuredImage, synopsis } = article;

        return {
            id, title, urlToken, synopsis,
            author: {
                id: author.id,
                firstName: author.firstName,
                lastName: author.lastName,
                urlToken: author.urlToken
            } as User,
            featuredImage: {
                id: featuredImage.id,
                url: featuredImage.url
            } as Media
        } as Article;
    }
}