import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Media } from "../entities/Media";
import { UserService } from "../services/userService";
import { MediaService } from "../services/mediaService";
import { Methods } from "../shared/methods";
import { MediaTypeEnum } from "../enums/MediaTypeEnum";
import { Constants } from "../shared/constants";
import { MediaNameEnum } from "../enums/MediaNameEnum";
import { User } from "../entities/User";
import { MapMedia } from "../mapping/mapMedia";

export class MediaController {

    private mediaRepository = getRepository(Media);

    async uploadAsync(req: Request, resp: Response, next: NextFunction) {
        const authUserId = UserService.getAuthenticatedUserId(req);
        const uploadedFileUrls = await MediaService.uploadFiles(req);

        if (!uploadedFileUrls || uploadedFileUrls.length < 1) {
            Methods.sendErrorResponse(resp, 400, "An error occured while uploading files");
        } else {
            const mediaToSave = new Array<Media>();

            uploadedFileUrls.forEach(url => {
                const fileExtension = Methods.getExtension(url);
                let type = MediaTypeEnum.Image;

                if (Constants.documentExtensions.some(e => e === fileExtension)) {
                    type = MediaTypeEnum.Document
                }

                const media = new Media({
                    type,
                    url,
                    name: MediaNameEnum.ProfilePhoto,
                    user: new User({ id: authUserId })
                });

                mediaToSave.push(media);
            });

            const savedMedia = await this.mediaRepository.save(mediaToSave);
            const response = savedMedia.map(m => MapMedia.inMediaControllerUploadAsync(m));

            return Methods.getJsonResponse(response, "File(s) upload was successful");
        }
    }
}