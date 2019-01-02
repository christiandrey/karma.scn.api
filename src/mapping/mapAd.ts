import { Ad } from "../entities/Ad";
import { MapMedia } from "./mapMedia";

export namespace MapAd {
	export function inAllControllers(ad: Ad) {
		const { id, media, clickCount } = ad;
		return {
			id,
			clickCount,
			media: MapMedia.inAllControllers(media)
		};
	}
}
