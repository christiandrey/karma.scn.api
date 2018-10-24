import { ArticleCategory } from "../entities/ArticleCategory";

export namespace MapArticleCategory {

    export function inArticleCategoriesControllerCreateAsync(articleCategory: ArticleCategory): ArticleCategory {
        return {
            id: articleCategory.id,
            title: articleCategory.title
        } as ArticleCategory;
    }

    export function inArticleCategoriesControllerUpdateAsync(articleCategory: ArticleCategory): ArticleCategory {
        return {
            id: articleCategory.id,
            title: articleCategory.title
        } as ArticleCategory;
    }

    export function inArticleCategoriesControllerDeleteAsync(articleCategory: ArticleCategory): ArticleCategory {
        return {
            id: articleCategory.id,
            title: articleCategory.title
        } as ArticleCategory;
    }

}