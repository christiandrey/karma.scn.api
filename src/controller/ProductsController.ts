import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { Methods } from "../shared/methods";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Product } from "../entities/Product";
import { MapProduct } from "../mapping/mapProduct";
import { Category } from "../entities/Category";

export class ProductsController {

    private productRepository = getRepository(Product);

    async getAllAsync(req: Request, resp: Response, next: NextFunction) {
        const products = await this.productRepository.find({
            order: {
                title: "ASC"
            }
        });

        const response = products.map(x => MapProduct.inAllControllers(x));

        return Methods.getJsonResponse(response, `${products.length} products found`);
    }

    async createAsync(req: Request, resp: Response, next: NextFunction) {
        const product = new Product(req.body);

        // ------------------------------------------------------------------------
        // Validate the data
        // ------------------------------------------------------------------------

        const validationResult = await validate(product);
        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Product data provided was not valid", false);
        }

        // ------------------------------------------------------------------------
        // Check for existing entity
        // ------------------------------------------------------------------------

        const name = Methods.toCamelCase(product.title.replace(/[^a-zA-Z0-9\s\s+]/g, ""));
        const dbProduct = await this.productRepository.findOne({ name });

        if (!!dbProduct) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: ["A product with the same title already exists"]
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "A product with the same title already exists", false);
        }

        // ------------------------------------------------------------------------
        // Create New Entity
        // ------------------------------------------------------------------------

        const { title, category } = product;

        const productToCreate = new Product({
            title,
            category: new Category({ id: category.id })
        });

        const createdProduct = await this.productRepository.save(productToCreate);
        const validResponse = new FormResponse<Product>({
            isValid: true,
            target: MapProduct.inAllControllers(createdProduct)
        });
        return Methods.getJsonResponse(validResponse);
    }

    async updateAsync(req: Request, resp: Response, next: NextFunction) {
        const product = new Product(req.body);
        const validationResult = await validate(product);

        if (validationResult.length > 0) {
            const invalidResponse = new FormResponse({
                isValid: false,
                errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
            } as IFormResponse);
            return Methods.getJsonResponse(invalidResponse, "Product data provided was not valid", false);
        }

        const dbProduct = await this.productRepository.findOne({ id: product.id });

        if (!dbProduct) {
            Methods.sendErrorResponse(resp, 404, "Product was not found");
            return;
        }

        dbProduct.title = product.title;

        const updatedProduct = await this.productRepository.save(dbProduct);
        const validResponse = new FormResponse<Product>({
            isValid: true,
            target: MapProduct.inAllControllers(updatedProduct)
        });
        return Methods.getJsonResponse(validResponse);
    }
}