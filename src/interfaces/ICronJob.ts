import { CronJobTypeEnum } from "../enums/CronJobTypeEnum";

export interface ICronJob {
	id: string;
	cron: string;
	type: CronJobTypeEnum;
	data: Array<string>;
}
