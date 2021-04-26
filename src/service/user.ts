import { Logger } from "winston";
import UserRepository from "../repository/user";

export default class UserService {
  constructor(private userRepository: UserRepository, private logger: Logger) {
    this.userRepository = userRepository;
    this.logger = logger;
  }

  public async ListUsers(): Promise<string> {
    this.logger.info("Requesting all users");

    const users = await this.userRepository.ListUsers();

    this.logger.info(`Got users from repository ${users}`);

    return JSON.stringify(users);
  }

  public async AddUser(user: string): Promise<void> {
    this.logger.info(`Adding user ${user}`);

    await this.userRepository.AddUser(user);
  }

  public async DeleteUser(user: string): Promise<void> {
    this.logger.info(`Deleting user ${user}`);

    await this.userRepository.DeleteUser(user);
  }
}
