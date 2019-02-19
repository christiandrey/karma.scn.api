import { CronJobTypeEnum } from "../enums/CronJobTypeEnum";

export interface ICronJob {
	id: string;
	cron: string;
	date: number;
	type: CronJobTypeEnum;
	data: Array<string>;
}
