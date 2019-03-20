declare module "cloudinary" {
	export function config(config: CloudinaryConfig): CloudinaryConfig;
	export function config(key: string, value: string): CloudinaryConfig;
	export function config(key: string): string;

	export const uploader: Uploader;

	export type CloudinaryConfig = {
		[key: string]: any;
		cloud_name: string;
		api_key: string;
		api_secret: string;
	};
}

interface Uploader {
	upload: (file: string, callback?: (uploaded: MediaItem) => void, options?: Partial<UploadOptions>) => Promise<MediaItem>;
}

interface MediaItem {
	public_id: string;
	secure_url: string;
	version: string;
	width: string;
	height: string;
	bytes: string;
	format: string;
}

interface UploadOptions {
	access_mode: any;
	allowed_formats: any;
	async: any;
	backup: any;
	callback: any;
	colors: any;
	discard_original_filename: any;
	eager: any;
	eager_async: any;
	eager_notification_url: any;
	exif: any;
	faces: any;
	folder: any;
	format: any;
	image_metadata: any;
	invalidate: any;
	moderation: any;
	notification_url: any;
	overwrite: any;
	phash: any;
	proxy: any;
	public_id: any;
	responsive_breakpoints: any;
	return_delete_token: any;
	timestamp: any;
	transformation: any;
	type: any;
	unique_filename: any;
	upload_preset: any;
	use_filename: any;
}
