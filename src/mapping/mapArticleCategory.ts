import { ArticleCategory } from "../entities/ArticleCategory";
import { Article } from "../entities/Article";

export namespace MapArticleCategory {
	export function inArticleCategoriesControllerGetAllAsync(articleCategory: ArticleCategory): ArticleCategory {
		return {
			id: articleCategory.id,
			createdDate: articleCategory.createdDate,
			title: articleCategory.title,
			articles: articleCategory.articles ? articleCategory.articles.map(x => new Article({ id: x.id })) : new Array<Article>()
		} as ArticleCategory;
	}

	export function inArticleCategoriesControllerCreateAsync(articleCategory: ArticleCategory): ArticleCategory {
		return {
			id: articleCategory.id,
			createdDate: articleCategory.createdDate,
			title: articleCategory.title
		} as ArticleCategory;
	}

	export function inArticleCategoriesControllerUpdateAsync(articleCategory: ArticleCategory): ArticleCategory {
		return {
			id: articleCategory.id,
			createdDate: articleCategory.createdDate,
			title: articleCategory.title
		} as ArticleCategory;
	}

	export function inArticleCategoriesControllerDeleteAsync(articleCategory: ArticleCategory): ArticleCategory {
		return {
			id: articleCategory.id,
			createdDate: articleCategory.createdDate,
			title: articleCategory.title
		} as ArticleCategory;
	}
}
