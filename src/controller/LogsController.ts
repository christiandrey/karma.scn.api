import { getRepository } from "typeorm";
import { Log } from "../entities/Log";
import { Request, Response, NextFunction } from "express";
import { MapLog } from "../mapping/mapLog";
import { Methods } from "../shared/methods";

export class LogsController {
	private logRepository = getRepository(Log);

	async getLatestAsync(req: Request, resp: Response, next: NextFunction) {
		const logs = await this.logRepository.find({
			order: {
				createdDate: "DESC"
			},
			take: 25
		});

		const response = logs.map(l => MapLog.inAllControllers(l));

		return Methods.getJsonResponse(response);
	}
}
