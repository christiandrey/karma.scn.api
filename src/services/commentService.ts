import { getRepository, getTreeRepository, TreeRepository } from "typeorm";
import { Comment } from "../entities/Comment";
import { IJsonResponse } from "../interfaces/IJsonResponse";
import { validate } from "class-validator";
import { FormResponse } from "../dto/classes/FormResponse";
import { IFormResponse } from "../dto/interfaces/IFormResponse";
import { Methods } from "../shared/methods";
import { Discussion } from "../entities/Discussion";
import { User } from "../entities/User";
import { UserService } from "./userService";
import { MapComment } from "../mapping/mapComment";
import { Request } from "express";
import { TimelineUpdate } from "../entities/TimelineUpdate";
import { TimelinePhoto } from "../entities/TimelinePhoto";
import { Webinar } from "../entities/Webinar";
import { Article } from "../entities/Article";
import { CacheService } from "./cacheService";
import { Constants } from "../shared/constants";

export namespace CommentService {
	export async function addCommentAsync(req: Request, comment: Comment): Promise<IJsonResponse<FormResponse<Comment>>> {
		const validationResult = await validate(comment);
		const authUser = await UserService.getAuthenticatedUserAsync(req);

		if (validationResult.length > 0) {
			const invalidResponse = new FormResponse<Comment>({
				isValid: false,
				errors: validationResult.map(e => e.constraints[Object.keys(e.constraints)[0]])
			} as IFormResponse);

			return Methods.getJsonResponse(invalidResponse, "Comment data provided was not valid", false);
		}

		const commentRepository = getTreeRepository(Comment);

		const { content, parentComment, discussion, article, timelineUpdate, timelinePhoto, webinar } = comment;

		const isRootComment = !comment.parentComment;

		const commentToCreate = new Comment({
			content: content.trim(),
			article: !!article && isRootComment ? new Article({ id: article.id }) : null,
			discussion: !!discussion && isRootComment ? new Discussion({ id: discussion.id }) : null,
			timelineUpdate: !!timelineUpdate && isRootComment ? new TimelineUpdate({ id: timelineUpdate.id }) : null,
			timelinePhoto: !!timelinePhoto && isRootComment ? new TimelinePhoto({ id: timelinePhoto.id }) : null,
			webinar: !!webinar && isRootComment ? new Webinar({ id: webinar.id }) : null,
			parentComment: !!parentComment ? new Comment({ id: parentComment.id }) : null,
			author: new User({ id: authUser.id })
		} as Comment);

		const createdComment = await commentRepository.save(commentToCreate);

		createdComment.author.firstName = authUser.firstName;
		createdComment.author.lastName = authUser.lastName;
		createdComment.author.profilePhoto = authUser.profilePhoto;
		createdComment.author.company = authUser.company;
		createdComment.author.type = authUser.type;

		const validResponse = new FormResponse<Comment>({
			isValid: true,
			target: MapComment.inAllControllers(createdComment)
		});

		CacheService.invalidateCacheItem(Constants.commentsTree);

		return Methods.getJsonResponse(validResponse);
	}

	export async function findRoots(commentTreeRepository: TreeRepository<Comment>): Promise<Array<Comment>> {
		const escapeAlias = (alias: string) => commentTreeRepository.manager.connection.driver.escape(alias);
		const escapeColumn = (column: string) => commentTreeRepository.manager.connection.driver.escape(column);
		const parentPropertyName = commentTreeRepository.manager.connection.namingStrategy.joinColumnName(
			commentTreeRepository.metadata.treeParentRelation!.propertyName,
			"id"
		);

		return commentTreeRepository
			.createQueryBuilder("treeEntity")
			.where(`${escapeAlias("treeEntity")}.${escapeColumn(parentPropertyName)} IS NULL`)
			.leftJoinAndSelect("treeEntity.author", "author")
			.leftJoinAndSelect("author.profilePhoto", "profilePhoto")
			.leftJoinAndSelect("author.company", "company")
			.leftJoinAndSelect("treeEntity.article", "article")
			.leftJoinAndSelect("treeEntity.discussion", "discussion")
			.leftJoinAndSelect("treeEntity.timelineUpdate", "timelineUpdate")
			.leftJoinAndSelect("treeEntity.timelinePhoto", "timelinePhoto")
			.leftJoinAndSelect("treeEntity.webinar", "webinar")
			.orderBy("treeEntity.createdDate", "DESC")
			.getMany();
	}

	export async function findTrees() {
		const commentTreeRepository = getTreeRepository(Comment);
		const roots = await findRoots(commentTreeRepository);
		await Promise.all(roots.map(root => findDescendantsTree(commentTreeRepository, root)));
		return roots;
	}

	async function findDescendantsTree(commentTreeRepository: TreeRepository<Comment>, entity: Comment): Promise<Comment> {
		return commentTreeRepository
			.createDescendantsQueryBuilder("treeEntity", "treeClosure", entity)
			.leftJoinAndSelect("treeEntity.author", "author")
			.leftJoinAndSelect("author.profilePhoto", "profilePhoto")
			.leftJoinAndSelect("author.company", "company")
			.orderBy("treeEntity.createdDate", "DESC")
			.getRawAndEntities()
			.then(entitiesAndScalars => {
				const relationMaps = createRelationMaps(commentTreeRepository, "treeEntity", entitiesAndScalars.raw);
				buildChildrenEntityTree(commentTreeRepository, entity, entitiesAndScalars.entities, relationMaps);
				return entity;
			});
	}

	function createRelationMaps(commentTreeRepository: TreeRepository<Comment>, alias: string, rawResults: any[]): { id: any; parentId: any }[] {
		return rawResults.map(rawResult => {
			const joinColumn = commentTreeRepository.metadata.treeParentRelation!.joinColumns[0];
			const joinColumnName = joinColumn.givenDatabaseName || joinColumn.databaseName;
			return {
				id: rawResult[alias + "_" + commentTreeRepository.metadata.primaryColumns[0].databaseName],
				parentId: rawResult[alias + "_" + joinColumnName]
			};
		});
	}

	function buildChildrenEntityTree(commentTreeRepository: TreeRepository<Comment>, entity: any, entities: any[], relationMaps: { id: any; parentId: any }[]): void {
		const childProperty = commentTreeRepository.metadata.treeChildrenRelation!.propertyName;
		const parentEntityId = commentTreeRepository.metadata.primaryColumns[0].getEntityValue(entity);
		const childRelationMaps = relationMaps.filter(relationMap => relationMap.parentId === parentEntityId);
		const childIds = childRelationMaps.map(relationMap => relationMap.id);
		entity[childProperty] = entities.filter(entity => childIds.indexOf(entity.id) !== -1);
		entity[childProperty].forEach((childEntity: any) => {
			buildChildrenEntityTree(commentTreeRepository, childEntity, entities, relationMaps);
		});
	}
}
