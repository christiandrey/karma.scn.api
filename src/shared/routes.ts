import { UsersController } from "../controller/UsersController";
import { AccountController } from "../controller/AccountController";
import { CategoriesController } from "../controller/CategoriesController";
import { SearchController } from "../controller/SearchController";
import { ArticleCategoriesController } from "../controller/ArticleCategoriesController";
import { ArticlesController } from "../controller/ArticlesController";
import { MediaController } from "../controller/MediaController";
import { CountriesController } from "../controller/CountriesController";
import { CompaniesController } from "../controller/CompaniesController";
import { ProductsController } from "../controller/ProductsController";
import { AnnouncementsController } from "../controller/AnnouncementsController";
import { CertificatesController } from "../controller/CertificatesController";
import { ConnectionsController } from "../controller/ConnectionsController";
import { DiscussionsController } from "../controller/DiscussionsController";
import { ExperiencesController } from "../controller/ExperiencesController";
import { JobsController } from "../controller/JobsController";
import { NotificationsController } from "../controller/NotificationsController";
import { ResourcesController } from "../controller/ResourcesController";
import { SkillsController } from "../controller/SkillsController";
import { WebinarsController } from "../controller/WebinarsController";
import { TimelineController } from "../controller/TimelineController";
import { AdsController } from "../controller/AdsController";
import { LogsController } from "../controller/LogsController";

export interface IRoute {
	method: string;
	route: string;
	controller: any;
	action: string;
	protected?: boolean;
	admin?: boolean;
}

export const Routes = [
	{
		method: "post",
		route: "/account/login",
		controller: AccountController,
		action: "login"
	},
	{
		method: "post",
		route: "/account/register",
		controller: AccountController,
		action: "register"
	},
	{
		method: "post",
		route: "/account/seed/:key",
		controller: AccountController,
		action: "seedAsync"
	},
	{
		method: "post",
		route: "/countries/seed/:key",
		controller: CountriesController,
		action: "seedAsync"
	},
	{
		method: "get",
		route: "/countries",
		controller: CountriesController,
		action: "getAllAsync"
	},
	{
		method: "post",
		route: "/search",
		controller: SearchController,
		action: "searchAsync"
	},
	{
		method: "get",
		route: "/search/locations",
		controller: SearchController,
		action: "getLocationsAsync"
	},
	{
		method: "get",
		route: "/article-categories",
		controller: ArticleCategoriesController,
		action: "getAllAsync"
	},
	{
		method: "post",
		route: "/article-categories",
		controller: ArticleCategoriesController,
		action: "createAsync",
		protected: true
	},
	{
		method: "put",
		route: "/article-categories",
		controller: ArticleCategoriesController,
		action: "updateAsync",
		protected: true,
		admin: true
	},
	{
		method: "delete",
		route: "/article-categories/:id",
		controller: ArticleCategoriesController,
		action: "deleteAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/articles",
		controller: ArticlesController,
		action: "getAllAsync"
	},
	{
		method: "get",
		route: "/articles/latest",
		controller: ArticlesController,
		action: "getLatestAsync"
	},
	{
		method: "get",
		route: "/articles/:urlToken",
		controller: ArticlesController,
		action: "getByUrlTokenAsync"
	},
	{
		method: "post",
		route: "/articles",
		controller: ArticlesController,
		action: "createAsync",
		protected: true
	},
	{
		method: "put",
		route: "/articles",
		controller: ArticlesController,
		action: "updateAsync",
		protected: true
	},
	{
		method: "post",
		route: "/articles/:id/publish",
		controller: ArticlesController,
		action: "publishAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/articles/:id/unpublish",
		controller: ArticlesController,
		action: "unPublishAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/articles/:id/comment",
		controller: ArticlesController,
		action: "addCommentAsync",
		protected: true
	},
	{
		method: "post",
		route: "/articles/:id/like",
		controller: ArticlesController,
		action: "likeArticleAsync",
		protected: true
	},
	{
		method: "post",
		route: "/articles/:id/unlike",
		controller: ArticlesController,
		action: "unlikeArticleAsync",
		protected: true
	},
	{
		method: "post",
		route: "/media",
		controller: MediaController,
		action: "uploadAsync",
		protected: true
	},
	{
		method: "get",
		route: "/media/:name",
		controller: MediaController,
		action: "getMediaAsync",
		protected: false
	},
	{
		method: "delete",
		route: "/media/:id",
		controller: MediaController,
		action: "deleteAsync",
		protected: true
	},
	{
		method: "get",
		route: "/users/members",
		controller: UsersController,
		action: "getMembersAsync",
		protected: true
	},
	{
		method: "get",
		route: "/users/vendors",
		controller: UsersController,
		action: "getVendorsAsync",
		protected: true
	},
	{
		method: "get",
		route: "/users/vendors/pending",
		controller: UsersController,
		action: "getPendingVendorsAsync",
		admin: true,
		protected: true
	},
	{
		method: "get",
		route: "/users/me/lite",
		controller: UsersController,
		action: "getProfileLiteAsync",
		protected: true
	},
	{
		method: "get",
		route: "/users/me/similar",
		controller: UsersController,
		action: "getSimilarProfilesAsync",
		protected: true
	},
	{
		method: "get",
		route: "/users/me",
		controller: UsersController,
		action: "getProfileAsync",
		protected: true
	},
	{
		method: "get",
		route: "/users/:urlToken",
		controller: UsersController,
		action: "getByUrlTokenAsync",
		protected: true
	},
	{
		method: "put",
		route: "/users/me",
		controller: UsersController,
		action: "updateAsync",
		protected: true
	},
	{
		method: "get",
		route: "/vendors/:urlToken",
		controller: CompaniesController,
		action: "getByUrlTokenAsync",
		protected: true
	},
	{
		method: "post",
		route: "/vendors",
		controller: CompaniesController,
		action: "createAsync",
		protected: true
	},
	{
		method: "put",
		route: "/vendors",
		controller: CompaniesController,
		action: "updateAsync",
		protected: true
	},
	{
		method: "put",
		route: "/vendors/:id/verify",
		controller: CompaniesController,
		action: "verifyAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/categories",
		controller: CategoriesController,
		action: "getAllAsync"
	},
	{
		method: "post",
		route: "/categories",
		controller: CategoriesController,
		action: "createAsync",
		protected: true
	},
	{
		method: "put",
		route: "/categories",
		controller: CategoriesController,
		action: "updateAsync",
		protected: true,
		admin: true
	},
	{
		method: "delete",
		route: "/categories/:id",
		controller: CategoriesController,
		action: "deleteAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/products",
		controller: ProductsController,
		action: "getAllAsync"
	},
	{
		method: "post",
		route: "/products",
		controller: ProductsController,
		action: "createAsync",
		protected: true
	},
	{
		method: "put",
		route: "/products",
		controller: ProductsController,
		action: "updateAsync",
		protected: true,
		admin: true
	},
	{
		method: "delete",
		route: "/products/:id",
		controller: ProductsController,
		action: "deleteAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/announcements",
		controller: AnnouncementsController,
		action: "getAllAsync",
		protected: true
	},
	{
		method: "post",
		route: "/announcements",
		controller: AnnouncementsController,
		action: "createAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/announcements/:id/publish",
		controller: AnnouncementsController,
		action: "publishAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/announcements/:id/unpublish",
		controller: AnnouncementsController,
		action: "unPublishAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/certificates",
		controller: CertificatesController,
		action: "createAsync",
		protected: true
	},
	{
		method: "get",
		route: "/connections/count",
		controller: ConnectionsController,
		action: "getConnectionsCountAsync",
		protected: true
	},
	{
		method: "get",
		route: "/connections",
		controller: ConnectionsController,
		action: "getConnectionsAsync",
		protected: true
	},
	{
		method: "get",
		route: "/connections/:urlToken",
		controller: ConnectionsController,
		action: "getConnectionsByUserUrlTokenAsync",
		protected: true
	},
	{
		method: "get",
		route: "/connections/me/pending",
		controller: ConnectionsController,
		action: "getConnectionRequestsAsync",
		protected: true
	},
	{
		method: "post",
		route: "/connections",
		controller: ConnectionsController,
		action: "connectAsync",
		protected: true
	},
	{
		method: "post",
		route: "/connections/:id/accept",
		controller: ConnectionsController,
		action: "acceptConnectionRequestAsync",
		protected: true
	},
	{
		method: "post",
		route: "/connections/:id/decline",
		controller: ConnectionsController,
		action: "declineConnectionRequestAsync",
		protected: true
	},
	{
		method: "get",
		route: "/discussions/latest",
		controller: DiscussionsController,
		action: "getLatestAsync",
		protected: true
	},
	{
		method: "get",
		route: "/discussions",
		controller: DiscussionsController,
		action: "getAllAsync",
		protected: true
	},
	{
		method: "get",
		route: "/discussions/:urlToken",
		controller: DiscussionsController,
		action: "getByUrlToken",
		protected: true
	},
	{
		method: "post",
		route: "/discussions",
		controller: DiscussionsController,
		action: "createAsync",
		protected: true
	},
	{
		method: "post",
		route: "/discussions/:id/comment",
		controller: DiscussionsController,
		action: "addCommentAsync",
		protected: true
	},
	{
		method: "post",
		route: "/experiences",
		controller: ExperiencesController,
		action: "createAsync",
		protected: true
	},
	{
		method: "get",
		route: "/jobs/latest",
		controller: JobsController,
		action: "getLatestAsync"
	},
	{
		method: "get",
		route: "/jobs",
		controller: JobsController,
		action: "getAllAsync",
		protected: true
	},
	{
		method: "get",
		route: "/jobs/:urlToken",
		controller: JobsController,
		action: "getByUrlTokenAsync",
		protected: true
	},
	{
		method: "post",
		route: "/jobs",
		controller: JobsController,
		action: "createAsync",
		protected: true
	},
	{
		method: "put",
		route: "/jobs",
		controller: JobsController,
		action: "updateAsync",
		protected: true
	},
	{
		method: "post",
		route: "/jobs/:id/publish",
		controller: JobsController,
		action: "publishAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/jobs/:id/unpublish",
		controller: JobsController,
		action: "unPublishAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/notifications",
		controller: NotificationsController,
		action: "getAllAsync",
		protected: true
	},
	{
		method: "put",
		route: "/notifications/read",
		controller: NotificationsController,
		action: "markAllNotificationsAsReadAsync",
		protected: true
	},
	{
		method: "get",
		route: "/resources",
		controller: ResourcesController,
		action: "getAllAsync",
		protected: true
	},
	{
		method: "post",
		route: "/resources",
		controller: ResourcesController,
		action: "createAsync",
		protected: true
	},
	{
		method: "put",
		route: "/resources",
		controller: ResourcesController,
		action: "updateAsync",
		protected: true
	},
	{
		method: "post",
		route: "/resources/:id/publish",
		controller: ResourcesController,
		action: "publishAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/resources/:id/unpublish",
		controller: ResourcesController,
		action: "unPublishAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/skills",
		controller: SkillsController,
		action: "getAllAsync"
	},
	{
		method: "post",
		route: "/skills",
		controller: SkillsController,
		action: "createAsync",
		protected: true,
		admin: true
	},
	{
		method: "delete",
		route: "/skills/:id",
		controller: SkillsController,
		action: "deleteAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/webinars",
		controller: WebinarsController,
		action: "getAllAsync",
		protected: true
	},
	{
		method: "get",
		route: "/webinars/upcoming",
		controller: WebinarsController,
		action: "getAllUpcomingAsync"
	},
	{
		method: "get",
		route: "/webinars/total-points",
		controller: WebinarsController,
		action: "getTotalCpdPoints"
	},
	{
		method: "get",
		route: "/webinars/:urlToken",
		controller: WebinarsController,
		action: "getByUrlTokenAsync",
		protected: true
	},
	{
		method: "post",
		route: "/webinars",
		controller: WebinarsController,
		action: "createAsync",
		protected: true,
		admin: true
	},
	{
		method: "put",
		route: "/webinars",
		controller: WebinarsController,
		action: "updateAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/webinars/:id/join",
		controller: WebinarsController,
		action: "joinAsync",
		protected: true
	},
	{
		method: "post",
		route: "/webinars/:id/start",
		controller: WebinarsController,
		action: "startAsync",
		protected: true
	},
	{
		method: "post",
		route: "/webinars/:id/finish",
		controller: WebinarsController,
		action: "finishAsync",
		protected: true
	},
	{
		method: "post",
		route: "/webinars/:id/comment",
		controller: WebinarsController,
		action: "addCommentAsync",
		protected: true
	},
	{
		method: "get",
		route: "/timeline/:page",
		controller: TimelineController,
		action: "getLatestAsync",
		protected: true
	},
	{
		method: "post",
		route: "/timeline/update",
		controller: TimelineController,
		action: "createTimelineUpdateAsync",
		protected: true
	},
	{
		method: "post",
		route: "/timeline/photo",
		controller: TimelineController,
		action: "createTimelinePhotoAsync",
		protected: true
	},
	{
		method: "post",
		route: "/timeline/update/:id/comment",
		controller: TimelineController,
		action: "addTimelineUpdateCommentAsync",
		protected: true
	},
	{
		method: "post",
		route: "/timeline/photo/:id/comment",
		controller: TimelineController,
		action: "addTimelinePhotoCommentAsync",
		protected: true
	},
	{
		method: "post",
		route: "/timeline/update/:id/like",
		controller: TimelineController,
		action: "likeTimelineUpdateAsync",
		protected: true
	},
	{
		method: "post",
		route: "/timeline/photo/:id/like",
		controller: TimelineController,
		action: "likeTimelinePhotoAsync",
		protected: true
	},
	{
		method: "delete",
		route: "/timeline/post/:id/unlike",
		controller: TimelineController,
		action: "unLikeTimelinePostAsync",
		protected: true
	},
	{
		method: "get",
		route: "/ads/:number",
		controller: AdsController,
		action: "getAsync"
	},
	{
		method: "get",
		route: "/ads",
		controller: AdsController,
		action: "getAllAsync",
		protected: true,
		admin: true
	},
	{
		method: "post",
		route: "/ads",
		controller: AdsController,
		action: "createAsync",
		protected: true,
		admin: true
	},
	{
		method: "put",
		route: "/ads/:id",
		controller: AdsController,
		action: "registerClickAsync"
	},
	{
		method: "delete",
		route: "/ads/:id",
		controller: AdsController,
		action: "deleteAsync",
		protected: true,
		admin: true
	},
	{
		method: "get",
		route: "/logs/latest",
		controller: LogsController,
		action: "getLatestAsync",
		protected: true,
		admin: true
	}
];
