import { Ad } from "../entities/Ad";
import { MapMedia } from "./mapMedia";

export namespace MapAd {
	export function inAllControllers(ad: Ad) {
		const { id, media, url, clickCount } = ad;
		return {
			id,
			url,
			clickCount,
			media: MapMedia.inAllControllers(media)
		};
	}
}
