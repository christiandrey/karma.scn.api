import * as nodeSchedule from "node-schedule";
import { Chance } from "chance";
import { CronJobTypeEnum } from "../enums/CronJobTypeEnum";
import { CacheService } from "./cacheService";
import { Constants } from "../shared/constants";
import { ICronJob } from "../interfaces/ICronJob";
import { SendEmailConfig } from "../dto/classes/SendEmailConfig";
import { Request } from "express";
import { EmailService } from "./emailService";
import { getRepository } from "typeorm";
import { User } from "../entities/User";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { Methods } from "../shared/methods";

export namespace CronService {
	// -------------------------------------------------------------------------------------------------
	/** Gets all cron jobs from the cache and starts them */
	export async function startAllCronJobs(req: Request): Promise<void> {
		const cronJobs = await retrieveJobsFromCache();
		await Methods.forEachAsync(cronJobs, async job => {
			const { id, cron, type, date, data } = job;
			if (!!date) {
				nodeSchedule.scheduleJob(new Date(date), await getCronExecutionFunction(req, id, type, data));
			} else {
				nodeSchedule.scheduleJob(cron, await getCronExecutionFunction(req, id, type, data));
			}
		});

		return Promise.resolve();
	}

	// -------------------------------------------------------------------------------------------------
	/** Schedule a new cron job. Jobs follow the cron format */
	export async function scheduleJob(req: Request, cron: string, type: CronJobTypeEnum, data?: Array<string>): Promise<void> {
		const chance = new Chance();
		const id = chance.string({ length: 15, pool: "abcdefghijklmnopqrstuvwxyz0123456789" });
		const cronExecutionFunction = await getCronExecutionFunction(req, id, type, data);
		nodeSchedule.scheduleJob(cron, cronExecutionFunction);
		const cronJob = {
			id,
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
	/** Schedule a quick date specific cron job */
	export async function scheduleJobWithDate(req: Request, date: Date, type: CronJobTypeEnum, data?: Array<string>): Promise<void> {
		const chance = new Chance();
		const id = chance.string({ length: 15, pool: "abcdefghijklmnopqrstuvwxyz0123456789" });
		const cronExecutionFunction = await getCronExecutionFunction(req, id, type, data);
		nodeSchedule.scheduleJob(date, cronExecutionFunction);
		const cronJob = {
			id,
			type,
			date: date.getTime(),
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
	/** Removes a job from the cache */
	async function removeJobFromCache(id: string): Promise<void> {
		const cronJobs = await retrieveJobsFromCache();
		const index = cronJobs.findIndex(x => x.id === id);
		if (index > -1) {
			cronJobs.splice(index, 1);
			try {
				await CacheService.addOrUpdateCacheItem(Constants.cronJobs, cronJobs);
				await CacheService.persistCacheItem(Constants.cronJobs);
				return Promise.resolve();
			} catch (error) {
				return Promise.reject();
			}
		}
		return Promise.reject();
	}

	// -------------------------------------------------------------------------------------------------
	/** Gets the cron job execution function */
	async function getCronExecutionFunction(req: Request, id: string, type: CronJobTypeEnum, data?: Array<string>): Promise<() => void> {
		if (type === CronJobTypeEnum.BirthdayMessage) {
			const email = data[0];
			const firstName = data[1];
			const sendEmailConfig = {
				to: email,
				subject: "Happy birthday!",
				heading: `Hi ${firstName},`,
				body: Constants.birthdayEmailContent
			} as SendEmailConfig;

			return Promise.resolve(async () => {
				await EmailService.sendEmailAsync(req, sendEmailConfig);
			});
		}

		if (type === CronJobTypeEnum.WebinarReminder) {
			const urlToken = data[0];
			const topic = data[1];
			const userRepository = getRepository(User);
			const emails = (await userRepository.find()).filter(x => x.type !== UserTypeEnum.Admin).map(x => x.email);
			const sendEmailConfig = {
				to: emails,
				subject: "Webinar Reminder",
				heading: `Hey there,`,
				body: Constants.webinarReminderEmailContent
					.replace("::webinar-topic::", topic)
					.replace("::buttonTitle::", "Join now")
					.replace("::buttonHref::", urlToken)
			} as SendEmailConfig;

			return Promise.resolve(async () => {
				await EmailService.sendEmailAsync(req, sendEmailConfig);
				await removeJobFromCache(id);
			});
		}

		if (type === CronJobTypeEnum.WelcomeEmail) {
			const email = data[0];
			const firstName = data[1];
			const sendEmailConfig = {
				to: email,
				subject: "Welcome to the Supply Chain Network",
				heading: `Hey ${firstName},`,
				body: Constants.welcomeEmailContent
			} as SendEmailConfig;

			return Promise.resolve(async () => {
				await EmailService.sendEmailAsync(req, sendEmailConfig);
				await removeJobFromCache(id);
			});
		}

		return;
	}
}
