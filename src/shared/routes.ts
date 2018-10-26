import { UsersController } from "../controller/UsersController";
import { AccountController } from "../controller/AccountController";
import { CategoriesController } from "../controller/CategoriesController";
import { SearchController } from "../controller/SearchController";
import { ArticleCategoriesController } from "../controller/ArticleCategoriesController";
import { ArticlesController } from "../controller/ArticlesController";
import { MediaController } from "../controller/MediaController";

export interface IRoute {
    method: string;
    route: string;
    controller: any;
    action: string;
    protected?: boolean;
    admin?: boolean;
}

export const Routes = [{
    method: "post",
    route: "/account/login",
    controller: AccountController,
    action: "login"
}, {
    method: "post",
    route: "/account/register",
    controller: AccountController,
    action: "register"
}, {
    method: "post",
    route: "/categories",
    controller: CategoriesController,
    action: "createAsync",
    protected: true,
    admin: true
}, {
    method: "put",
    route: "/categories",
    controller: CategoriesController,
    action: "updateAsync",
    protected: true,
    admin: true
}, {
    method: "delete",
    route: "/categories/:id",
    controller: CategoriesController,
    action: "deleteAsync",
    protected: true,
    admin: true
}, {
    method: "get",
    route: "/search/:type/:category/:location",
    controller: SearchController,
    action: "searchAsync"
}, {
    method: "post",
    route: "/article-categories",
    controller: ArticleCategoriesController,
    action: "createAsync",
    protected: true
}, {
    method: "put",
    route: "/article-categories",
    controller: ArticleCategoriesController,
    action: "updateAsync",
    protected: true,
    admin: true
}, {
    method: "delete",
    route: "/article-categories/:id",
    controller: ArticleCategoriesController,
    action: "deleteAsync",
    protected: true,
    admin: true
}, {
    method: "get",
    route: "/articles",
    controller: ArticlesController,
    action: "getAll"
}, {
    method: "get",
    route: "/articles/latest",
    controller: ArticlesController,
    action: "getLatestAsync"
}, {
    method: "get",
    route: "/articles/:urlToken",
    controller: ArticlesController,
    action: "getByUrlToken"
}, {
    method: "post",
    route: "/articles",
    controller: ArticlesController,
    action: "createAsync",
    protected: true
}, {
    method: "put",
    route: "/articles",
    controller: ArticlesController,
    action: "updateAsync",
    protected: true
}, {
    method: "post",
    route: "/articles/:id",
    controller: ArticlesController,
    action: "publishAsync",
    protected: true,
    admin: true
}, {
    method: "post",
    route: "/articles/:id",
    controller: ArticlesController,
    action: "unPublishAsync",
    protected: true,
    admin: true
}, {
    method: "post",
    route: "/media",
    controller: MediaController,
    action: "uploadAsync",
    protected: true
}, {
    method: "get",
    route: "/media/:name",
    controller: MediaController,
    action: "getMediaAsync",
    protected: false
}, {
    method: "delete",
    route: "/media/:id",
    controller: MediaController,
    action: "deleteAsync",
    protected: true
}];