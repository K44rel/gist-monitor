import { RedisClient } from "redis";
import { promisify } from "util";
import { Logger } from "winston";
import { GistResponse } from "../types/gist";

export default class GistRepository {
  constructor(private redisClient: RedisClient, private logger: Logger) {
    this.redisClient = redisClient;
    this.logger = logger;
  }

  public async AddRecent(user: string, recent: GistResponse[]): Promise<void> {
    const asyncSadd = promisify(this.redisClient.sadd).bind(this.redisClient);
    this.logger.info(`Persisting recent gists to repository for user ${user}`);

    const key = this.recentKey(user);
    await asyncSadd(key, JSON.stringify(recent));
  }

  public async DeleteRecent(user: string): Promise<void> {
    const asyncDel = promisify(this.redisClient.del).bind(this.redisClient);
    this.logger.info(`Deleting recent gists from repository for user ${user}`);

    const key = this.recentKey(user);
    await asyncDel(key);
  }

  public async GetRecent(user: string): Promise<GistResponse[]> {
    const asyncSmembers = promisify(this.redisClient.smembers).bind(
      this.redisClient
    );
    this.logger.info(`Getting recent gists for user ${user}`);

    const key = this.recentKey(user);

    try {
      const recent = await asyncSmembers(key);
      this.logger.silly(`Got gists ${recent}`);
      return JSON.parse(recent);
    } catch (error) {
      return [];
    }
  }

  public async SaveRecents(
    user: string,
    recents: GistResponse[]
  ): Promise<void> {
    const asyncSet = promisify(this.redisClient.set).bind(this.redisClient);
    recents.forEach(async (recent) => {
      const key = this.saveKey(user, recent);
      this.logger.debug(`Saving previous gist with key ${key}`);
      await asyncSet(key, JSON.stringify(recent));
    });
  }

  public async Exists(user: string, recent: GistResponse): Promise<boolean> {
    const asyncExists = promisify(this.redisClient.exists).bind(
      this.redisClient
    );
    const key = this.saveKey(user, recent);
    const exists = (await asyncExists(key)) === 1;
    this.logger.silly(`Checking for existance of key ${key} exists: ${exists}`);
    return exists;
  }

  private saveKey = (user: string, recent: GistResponse): string =>
    `${user}:${recent.id}`;
  private recentKey = (user: string): string => `${user}:recent`;
}
