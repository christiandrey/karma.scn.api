import { Category } from "../entities/Category";

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

}