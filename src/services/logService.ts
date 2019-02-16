import { LogTypeEnum } from "../enums/LogTypeEnum";
import { getRepository } from "typeorm";
import { Log } from "../entities/Log";
import { Request } from "express";
import { SocketService } from "./socketService";

export namespace LogService {
	// -------------------------------------------------------------------------------------------------
	/** Create a new log entry */
	export async function log(req: Request, title: string, message?: string, type: LogTypeEnum = LogTypeEnum.Default): Promise<boolean> {
		const logRepository = getRepository(Log);
		const log = new Log({
			title,
			message,
			type
		} as Log);

		await logRepository.save(log);
		await SocketService.emitLogEventToAdminAsync(req, log);

		return Promise.resolve(true);
	}
}
