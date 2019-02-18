import * as nodeSchedule from "node-schedule";
import { Chance } from "chance";
import { CronJobTypeEnum } from "../enums/CronJobTypeEnum";
import { CacheService } from "./cacheService";
import { Constants } from "../shared/constants";
import { ICronJob } from "../interfaces/ICronJob";
import { SendEmailConfig } from "../dto/classes/SendEmailConfig";
import { Request } from "express";
import { EmailService } from "./emailService";

export namespace CronService {
	// -------------------------------------------------------------------------------------------------
	/** Gets all cron jobs from the cache and starts them */
	export async function startAllCronJobs(req: Request): Promise<void> {
		const cronJobs = await retrieveJobsFromCache();
		cronJobs.forEach(job => {
			const { cron, type, data } = job;
			nodeSchedule.scheduleJob(cron, getCronExecutionFunction(req, type, data));
		});
		return Promise.resolve();
	}

	// -------------------------------------------------------------------------------------------------
	/** Schedule a new cron job. Jobs follow the cron format */
	export async function scheduleJob(req: Request, cron: string, type: CronJobTypeEnum, data?: Array<string>): Promise<void> {
		const chance = new Chance();
		nodeSchedule.scheduleJob(cron, getCronExecutionFunction(req, type, data));
		const cronJob = {
			id: chance.string({ length: 15, pool: "abcdefghijklmnopqrstuvwxyz0123456789" }),
			type,
			cron,
			data
		} as ICronJob;
		const cronJobs = await retrieveJobsFromCache();

		cronJobs.unshift(cronJob);

		try {
			await CacheService.addOrUpdateCacheItem(Constants.cronJobs, cronJobs);
			await CacheService.persistCacheItem(Constants.cronJobs);
			return Promise.resolve();
		} catch (error) {
			return Promise.reject();
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Gets all cron jobs from the cache */
	async function retrieveJobsFromCache(): Promise<Array<ICronJob>> {
		const cronJobs = await CacheService.getCacheItemValue(Constants.cronJobs, () => new Array<ICronJob>());
		return Promise.resolve(cronJobs);
	}

	// -------------------------------------------------------------------------------------------------
	/** Gets the cron job exceution function */
	function getCronExecutionFunction(req: Request, type: CronJobTypeEnum, data?: Array<string>): () => void {
		if (type === CronJobTypeEnum.BirthdayMessage) {
			const sendEmailConfig = {
				to: "oluwaseun.adedire@gmail.com",
				subject: "Happy birthday",
				text: "Happy birthday to you my guy!"
			} as SendEmailConfig;
			return async () => {
				await EmailService.sendEmailAsync(req, sendEmailConfig);
			};
		}

		if (type === CronJobTypeEnum.WebinarReminder) {
			return () => 2 * 3;
		}

		return;
	}
}
