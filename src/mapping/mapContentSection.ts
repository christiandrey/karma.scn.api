import { ContentSection } from "../entities/ContentSection";

export namespace MapContentSection {
	export function inAllControllers(contentSection: ContentSection) {
		const { id, content, createdDate, title, note } = contentSection;
		return {
			id,
			content,
			createdDate,
			title,
			note
		};
	}
}
