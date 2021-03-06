import { createClient, RedisClient } from "redis";
import { promisify } from "util";
import { Constants } from "../shared/constants";

export namespace CacheService {
	// -------------------------------------------------------------------------------------------------
	/** Creates a new redis client */
	export function createRedisClient(): RedisClient {
		const client = createClient(Constants.redisURL);
		return client;
	}

	// -------------------------------------------------------------------------------------------------
	/** Add or Update Redis cache item */
	export async function addOrUpdateCacheItem<T>(key: string, value: T, redisClient?: RedisClient): Promise<void> {
		const client = !!redisClient ? redisClient : createRedisClient();
		const setExAsync = promisify(client.setex).bind(client);
		const result = await setExAsync(key, Constants.redisTTL, JSON.stringify(value));
		if (!!result) {
			return Promise.resolve();
		} else {
			return Promise.reject();
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Get cache item value */
	export async function getCacheItemValue<T>(key: string, storeFunction: () => T, redisClient?: RedisClient): Promise<T> {
		const client = !!redisClient ? redisClient : createRedisClient();
		const getAsync = promisify(client.get).bind(client);

		const item = await getAsync(key);
		// const item = false;

		if (!!item) {
			return Promise.resolve(JSON.parse(item) as T);
		} else {
			const value = await storeFunction();
			await addOrUpdateCacheItem(key, value, client);
			return Promise.resolve(value);
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Persists a cache item */
	export async function persistCacheItem(key: string, redisClient?: RedisClient): Promise<void> {
		const client = !!redisClient ? redisClient : createRedisClient();
		const persistAsync = promisify(client.persist).bind(client);

		try {
			await persistAsync(key);
			return Promise.resolve();
		} catch (error) {
			return Promise.reject();
		}
	}

	// -------------------------------------------------------------------------------------------------
	/** Invalidate cache item */
	export function invalidateCacheItem(key: string, redisClient?: RedisClient): void {
		const client = !!redisClient ? redisClient : createRedisClient();
		client.del(key);
	}
}
