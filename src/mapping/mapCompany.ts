import { Company } from "../entities/Company";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

export namespace MapCompany {

    export function inSearchControllerSearchAsync(company: Company): Company {
        return {
            id: company.id,
            urlToken: company.urlToken,
            logoUrl: company.logoUrl,
            name: company.name,
            category: {
                id: company.category.id,
                title: company.category.title,
                name: company.category.name
            } as Category,
            products: company.products.length > 0 ? company.products.map(p => {
                return {
                    id: p.id,
                    title: p.title,
                    name: p.name
                } as Product;
            }) : new Array<Product>()
        } as Company;
    }

}