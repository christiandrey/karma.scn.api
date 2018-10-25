import * as fileUpload from "express-fileupload";
import * as sharp from "sharp";
import { Request } from "express";
import { Methods } from "../shared/methods";
import { Constants } from "../shared/constants";
import { Chance } from "chance";

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
                    pool: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
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
    /** Optimise image files */
    async function optimiseImage(inputStream: Buffer, fileExtension: string, fileSaveName: string): Promise<boolean> {

        // -------------------------------------------------------
        // RESIZE IMAGE
        // -------------------------------------------------------
        let imageData = sharp(inputStream)
            .resize(null, null, {
                width: 650,
                withoutEnlargement: true
            });

        // -------------------------------------------------------
        // COMPRESS IMAGE, IF POSSIBLE
        // -------------------------------------------------------
        if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
            imageData = imageData.toFormat("jpeg", {
                quality: 50
            });
        }

        // -------------------------------------------------------
        // WRITE IMAGE TO FILE
        // -------------------------------------------------------
        const saveResult = await imageData.toFile(fileSaveName);

        if (!!saveResult) {
            return true;
        }

        return false;
    }
}