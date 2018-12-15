import { Product } from "../entities/Product";
import { MapCategory } from "./mapCategory";

export namespace MapProduct {
	export function inAllControllers(product: Product): Product {
		const { id, createdDate, title, name, category } = product;
		return {
			id,
			createdDate,
			title,
			name,
			category: !!category ? MapCategory.inAllControllers(category) : new Array<Product>()
		} as Product;
	}
}
