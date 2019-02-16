import { Log } from "../entities/Log";

export namespace MapLog {
	export function inAllControllers(log: Log) {
		const { id, createdDate, title, type, message } = log;
		return {
			id,
			createdDate,
			title,
			type,
			message
		};
	}
}
