import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Media } from "../entities/Media";
import { UserService } from "../services/userService";
import { MediaService } from "../services/mediaService";
import { Methods } from "../shared/methods";
import { MediaNameEnum } from "../enums/MediaNameEnum";
import { User } from "../entities/User";
import { MapMedia } from "../mapping/mapMedia";
import { Company } from "../entities/Company";
import { Constants } from "../shared/constants";
import { createReadStream, exists } from "fs";
import { promisify } from "util";
import { LogService } from "../services/logService";
import { LogTypeEnum } from "../enums/LogTypeEnum";

export class MediaController {
	private mediaRepository = getRepository(Media);

	async uploadAsync(req: Request, resp: Response, next: NextFunction) {
		const authUser = await UserService.getAuthenticatedUserAsync(req);
		const createdMedia = await MediaService.uploadFilesAsync(req);

		if (!createdMedia || createdMedia.length < 1) {
			Methods.sendErrorResponse(resp, 400, "An error occured while uploading the files");
		} else {
			createdMedia.forEach(media => {
				if (media.name === MediaNameEnum.CompanyDocument && !!authUser.company) {
					media.company = new Company({ id: authUser.company.id });
				} else {
					media.user = new User({ id: authUser.id });
				}
			});

			const savedMedia = await this.mediaRepository.save(createdMedia);
			const response = savedMedia.map(m => MapMedia.inMediaControllerUploadAsync(m));

			return Methods.getJsonResponse(response, "Upload operation was successfully completed");
		}
	}

	async getMediaAsync(req: Request, resp: Response, next: NextFunction) {
		const name = req.params.name.toLowerCase() as string;
		const extension = Methods.getExtension(name);

		if (![...Constants.documentExtensions, ...Constants.imageExtensions].some(e => e === extension)) {
			Methods.sendErrorResponse(resp, 404, "Media was not found");
		} else {
			let uploadPath: string;

			if (Constants.imageExtensions.some(e => e === extension)) {
				uploadPath = Constants.paths.imageUploadPath;
			}

			if (Constants.documentExtensions.some(e => e === extension)) {
				uploadPath = Constants.paths.documentUploadPath;
			}

			const filePath = `${Methods.getBaseFolder()}${uploadPath}${name}`;

			const existsAsync = promisify(exists);

			const fileExists = await existsAsync(filePath);

			if (fileExists) {
				resp.setHeader("Content-Type", Methods.getMimeTypeFromExtension(extension));
				createReadStream(filePath).pipe(resp);
			} else {
				Methods.sendErrorResponse(resp, 404, "Media was not found");
			}
		}
	}

	async deleteAsync(req: Request, resp: Response, next: NextFunction) {
		const mediaToDelete = await this.mediaRepository.findOne(req.params.id);

		if (!!mediaToDelete) {
			try {
				await MediaService.deleteFileAsync(req, mediaToDelete.url);
				const deletedMedia = await this.mediaRepository.remove(mediaToDelete);
				return Methods.getJsonResponse(MapMedia.inMediaControllerDeleteAsync(deletedMedia), "Delete operation was successful");
			} catch (error) {
				await LogService.log(req, "An error occured while deleting a media item.", error.toString(), LogTypeEnum.Exception);
				return Methods.getJsonResponse({}, error.toString(), false);
			}
		}
		Methods.sendErrorResponse(resp, 404, "Media was not found");
	}
}
