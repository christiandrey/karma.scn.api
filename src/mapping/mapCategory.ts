import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

export namespace MapCategory {
	export function inCategoriesControllerCreateAsync(category: Category): Category {
		return {
			id: category.id,
			title: category.title
		} as Category;
	}

	export function inCategoriesControllerUpdateAsync(category: Category): Category {
		return {
			id: category.id,
			title: category.title
		} as Category;
	}

	export function inCategoriesControllerDeleteAsync(category: Category): Category {
		return {
			id: category.id,
			title: category.title
		} as Category;
	}

	export function inAllControllers(category: Category): Category {
		return {
			id: category.id,
			name: category.name,
			title: category.title,
			products: category.products
				? category.products.map(x => {
						return {
							id: x.id,
							title: x.title
						};
				  })
				: new Array<Product>()
		} as Category;
	}
}
