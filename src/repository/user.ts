import { RedisClient } from "redis";
import { promisify } from "util";
import { Logger } from "winston";

const USERS = "users";

export default class UserRepository {
  constructor(private redisClient: RedisClient, private logger: Logger) {
    this.redisClient = redisClient;
    this.logger = logger;
  }

  public async ListUsers(): Promise<string[]> {
    const asyncSmembers = promisify(this.redisClient.smembers).bind(
      this.redisClient
    );
    this.logger.info("Querying repository for all users");

    const users = asyncSmembers(USERS);
    return users;
  }

  public async AddUser(user: string): Promise<void> {
    const asyncSadd = promisify(this.redisClient.sadd).bind(this.redisClient);

    this.logger.info(`Adding user ${user} into repository`);
    return asyncSadd(USERS, user);
  }

  public async DeleteUser(user: string): Promise<void> {
    const asyncSrem = promisify(this.redisClient.srem).bind(this.redisClient);

    this.logger.info(`Removing user ${user} from repository`);
    return asyncSrem(USERS, user);
  }
}
