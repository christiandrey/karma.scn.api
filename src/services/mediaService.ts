import * as fileUpload from "express-fileupload";
import * as sharp from "sharp";
import * as cloudinary from "cloudinary";
import { Request } from "express";
import { Methods } from "../shared/methods";
import { Constants } from "../shared/constants";
import { Chance } from "chance";
import { Media } from "../entities/Media";
import { MediaNameEnum } from "../enums/MediaNameEnum";
import { MediaTypeEnum } from "../enums/MediaTypeEnum";
import { promisify } from "util";
import { unlink } from "fs";
import { LogService } from "./logService";
import { LogTypeEnum } from "../enums/LogTypeEnum";

export namespace MediaService {
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
			const mediaName = !!fileBodyData["mediaName"] ? (+fileBodyData["mediaName"] as MediaNameEnum) : MediaNameEnum.ProfilePhoto;
			const note = !!fileBodyData["note"] ? (fileBodyData["note"] as string) : null;

			await Methods.forEachAsync(files, async f => {
				const file = req.files[f] as fileUpload.UploadedFile;
				const fileExtension = Methods.getExtension(file.name).toLowerCase();
				const generatedFileName = chance.string({ length: 15, pool: "abcdefghijklmnopqrstuvwxyz0123456789" });
				const fileSaveName = `${generatedFileName}${fileExtension}`;

				if (Constants.imageExtensions.some(e => e === fileExtension)) {
					const mediaType = MediaTypeEnum.Image;
					const fileSavePath = `${Methods.getAppHostName(req)}/media/${fileSaveName}`;
					const fileSaveRelativePath = `${Methods.getBaseFolder()}${Constants.paths.imageUploadPath}${fileSaveName}`;
					const optimiseImageResult = await optimiseImage(file.data, fileExtension, fileSaveRelativePath);

					if (optimiseImageResult) {
						// --------------------------------------------------------------
						// UPLOAD MEDIA FILE TO FILE HOST
						// --------------------------------------------------------------
						await uploadToFileHost(fileSaveRelativePath.replace(fileExtension, `_thumb${fileExtension}`), `${generatedFileName}_thumb`);
						const uploadedMedia = await uploadToFileHost(fileSaveRelativePath, generatedFileName);

						// --------------------------------------------------------------
						// CREATE AND PERSIST MEDIA INSTANCE IN DATABASE
						// --------------------------------------------------------------
						const media = new Media({
							note,
							type: mediaType,
							name: mediaName,
							url: uploadedMedia.secure_url
						});
						createdMedia.push(media);

						// --------------------------------------------------------------
						// CLEAN UP UNUSED FILES
						// --------------------------------------------------------------
						const unlinkAsync = promisify(unlink);
						await unlinkAsync(fileSaveRelativePath);
						await unlinkAsync(fileSaveRelativePath.replace(fileExtension, `_thumb${fileExtension}`));
					}
				} else {
					const mediaType = MediaTypeEnum.Document;
					const fileSavePath = `${Methods.getAppHostName(req)}/media/${fileSaveName}`;
					const fileSaveRelativePath = `${Methods.getBaseFolder()}${Constants.paths.documentUploadPath}${fileSaveName}`;
					await file.mv(fileSaveRelativePath);

					// --------------------------------------------------------------
					// UPLOAD MEDIA FILE TO FILE HOST
					// --------------------------------------------------------------
					const uploadedMedia = await uploadToFileHost(fileSaveRelativePath, generatedFileName, "document");

					// --------------------------------------------------------------
					// CREATE AND PERSIST MEDIA INSTANCE IN DATABASE
					// --------------------------------------------------------------
					const media = new Media({
						note,
						type: mediaType,
						name: mediaName,
						url: uploadedMedia.secure_url
					});
					createdMedia.push(media);

					// --------------------------------------------------------------
					// CLEAN UP UNUSED FILE
					// --------------------------------------------------------------
					const unlinkAsync = promisify(unlink);
					await unlinkAsync(fileSaveRelativePath);
				}
			});

			return createdMedia;
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Upload a file or group of files asynchronously and returns a list of media */
	export async function deleteFileAsync(req: Request, path: string): Promise<boolean> {
		const name = path.replace(`${Methods.getAppHostName(req)}/media/`, "");
		const extension = Methods.getExtension(name);

		let uploadPath: string;
		let deleteThumb = false;

		if (Constants.imageExtensions.some(e => e === extension)) {
			uploadPath = Constants.paths.imageUploadPath;
			deleteThumb = true;
		}

		if (Constants.documentExtensions.some(e => e === extension)) {
			uploadPath = Constants.paths.documentUploadPath;
		}

		const unlinkAsync = promisify(unlink);

		try {
			await unlinkAsync(`${Methods.getBaseFolder()}${uploadPath}${name}`);
			if (deleteThumb) {
				await unlinkAsync(`${Methods.getBaseFolder()}${uploadPath}${name.replace(extension, `_thumb${extension}`)}`);
			}
			return true;
		} catch (error) {
			await LogService.log(req, `An error occured while deleting the file ${name}.`, error.toString(), LogTypeEnum.Exception);
			return false;
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Optimise image files */
	async function optimiseImage(inputStream: Buffer, fileExtension: string, fileSaveName: string): Promise<boolean> {
		// -------------------------------------------------------
		// RESIZE IMAGE AND CREATE THUMBNAIL
		// -------------------------------------------------------
		let imageData = sharp(inputStream).resize(null, null, {
			width: 800,
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
				quality: 50
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

	// -------------------------------------------------------------------------------------------------
	/** Upload file to file host */
	async function uploadToFileHost(filePath: string, fileName?: string, type: "image" | "document" = "image"): Promise<MediaItem> {
		const result = cloudinary.uploader.upload(filePath, null, {
			folder: `${type}s/`,
			public_id: fileName
		});

		return result;
	}
}
