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
            })

            const savedMedia = await this.mediaRepository.save(createdMedia);
            const response = savedMedia.map(m => MapMedia.inMediaControllerUploadAsync(m));

            return Methods.getJsonResponse(response, "Upload operation was successfully completed");
        }
    }

    async getMediaAsync(req: Request, resp: Response, next: NextFunction) {
        // const urlToken
    }
}