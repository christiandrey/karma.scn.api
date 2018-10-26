import * as fileUpload from "express-fileupload";
import * as sharp from "sharp";
import { Request } from "express";
import { Methods } from "../shared/methods";
import { Constants } from "../shared/constants";
import { Chance } from "chance";
import { Media } from "../entities/Media";
import { MediaNameEnum } from "../enums/MediaNameEnum";
import { MediaTypeEnum } from "../enums/MediaTypeEnum";

export namespace MediaService {

    // -------------------------------------------------------------------------------------------------
    /** Upload a file or group of files and returns a list of urls */
    export async function uploadFiles(req: Request): Promise<Array<string>> {

        if (!req.files) {
            return new Array<string>();
        } else {
            const files = Object.keys(req.files);
            const fileUrls = new Array<string>();
            const chance = new Chance();

            await Methods.forEachAsync(files, async (f) => {
                const file = req.files[f] as fileUpload.UploadedFile;
                const fileExtension = Methods.getExtension(file.name).toLowerCase();
                const fileSaveName = `${chance.string({
                    length: 15,
                    pool: "abcdefghijklmnopqrstuvwxyz0123456789"
                })}${fileExtension}`;

                if (Constants.imageExtensions.some(e => e === fileExtension)) {
                    const fileSavePath = `${Methods.getAppHostName(req)}${Constants.paths.imageUploadPath}${fileSaveName}`;
                    const fileSaveRelativePath = `${Methods.getBaseFolder()}${Constants.paths.imageUploadPath}${fileSaveName}`;
                    const optimiseImageResult = await optimiseImage(file.data, fileExtension, fileSaveRelativePath);
                    if (optimiseImageResult) {
                        fileUrls.push(fileSavePath);
                    }
                } else {
                    const fileSavePath = `${Methods.getAppHostName(req)}${Constants.paths.documentUploadPath}${fileSaveName}`;
                    const fileSaveRelativePath = `${Methods.getBaseFolder()}${Constants.paths.documentUploadPath}${fileSaveName}`;
                    await file.mv(fileSaveRelativePath);
                    fileUrls.push(fileSavePath);
                }
            });

            return fileUrls;
        }
    }

    // -------------------------------------------------------------------------------------------------
    /** Upload a file or group of files asynchronously and returns a list of media */
    export async function uploadFilesAsync(req: Request): Promise<Array<Media>> {

        if (!req.files) {
            return new Array<Media>();
        } else {
            const files = Object.keys(req.files);
            const fileBodyData = req.body;
            const createdMedia = new Array<Media>();
            const chance = new Chance();
            const mediaName = !!fileBodyData["mediaName"] ? +fileBodyData["mediaName"] as MediaNameEnum : MediaNameEnum.ProfilePhoto;
            const note = !!fileBodyData["note"] ? fileBodyData["note"] as string : null;

            await Methods.forEachAsync(files, async (f) => {
                const file = req.files[f] as fileUpload.UploadedFile;
                const fileExtension = Methods.getExtension(file.name).toLowerCase();
                const generatedFileName = chance.string({ length: 15, pool: "abcdefghijklmnopqrstuvwxyz0123456789" });
                const fileSaveName = `${generatedFileName}${fileExtension}`;

                if (Constants.imageExtensions.some(e => e === fileExtension)) {
                    const mediaType = MediaTypeEnum.Image;
                    const fileSavePath = `${Methods.getAppHostName(req)}${Constants.paths.imageUploadPath}${fileSaveName}`;
                    const fileSaveRelativePath = `${Methods.getBaseFolder()}${Constants.paths.imageUploadPath}${fileSaveName}`;
                    const optimiseImageResult = await optimiseImage(file.data, fileExtension, fileSaveRelativePath);

                    if (optimiseImageResult) {
                        const media = new Media({
                            note,
                            type: mediaType,
                            name: mediaName,
                            url: fileSavePath
                        });
                        createdMedia.push(media);
                    }
                } else {
                    const mediaType = MediaTypeEnum.Document;
                    const fileSavePath = `${Methods.getAppHostName(req)}${Constants.paths.documentUploadPath}${fileSaveName}`;
                    const fileSaveRelativePath = `${Methods.getBaseFolder()}${Constants.paths.documentUploadPath}${fileSaveName}`;
                    await file.mv(fileSaveRelativePath);

                    const media = new Media({
                        note,
                        type: mediaType,
                        name: mediaName,
                        url: fileSavePath
                    });
                    createdMedia.push(media);
                }
            });

            return createdMedia;
        }
    }

    // -------------------------------------------------------------------------------------------------
    /** Optimise image files */
    async function optimiseImage(inputStream: Buffer, fileExtension: string, fileSaveName: string): Promise<boolean> {

        // -------------------------------------------------------
        // RESIZE IMAGE AND CREATE THUMBNAIL
        // -------------------------------------------------------
        let imageData = sharp(inputStream).resize(null, null, {
            width: 650,
            withoutEnlargement: true
        });
        let thumbnailData = sharp(inputStream).resize(null, null, {
            width: 90,
            withoutEnlargement: true
        });

        // -------------------------------------------------------
        // COMPRESS IMAGE, IF POSSIBLE
        // -------------------------------------------------------
        if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
            imageData = imageData.toFormat("jpeg", {
                quality: 40
            });
            thumbnailData = thumbnailData.toFormat("jpeg", {
                quality: 35
            });
        }

        // -------------------------------------------------------
        // WRITE IMAGE TO FILE
        // -------------------------------------------------------
        const thumbnailFileSaveName = fileSaveName.replace(fileExtension, `_thumb${fileExtension}`);
        const saveImage = await imageData.toFile(fileSaveName);
        const saveThumbnail = await thumbnailData.toFile(thumbnailFileSaveName);

        if (!!saveImage && !!saveThumbnail) {
            return true;
        }

        return false;
    }
}