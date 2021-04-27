import { Logger } from "winston";
import GistRepository from "../repository/gist";
import UserRepository from "../repository/user";
import { GistResponse } from "../types/gist";
import GithubService from "./github";

export default class GistService {
  constructor(
    private userRepository: UserRepository,
    private gistRepository: GistRepository,
    private githubService: GithubService,
    private logger: Logger
  ) {
    this.userRepository = userRepository;
    this.gistRepository = gistRepository;
    this.githubService = githubService;
    this.logger = logger;
  }

  public async UpdateGists(): Promise<void> {
    const users = await this.userRepository.ListUsers();

    this.logger.info(`Updating recent gists for users ${users}`);

    for (const user of users) {
      const previous = await this.gistRepository.GetRecent(user);

      await this.gistRepository.SaveRecents(user, previous);

      await this.gistRepository.DeleteRecent(user);

      const gists = await this.githubService.RequestGists(user);

      this.logger.info(
        `Got ${gists.length} gists from github for user ${user}`
      );

      const newGists = gists.filter((gist) => {
        const exists = this.gistRepository.Exists(user, gist);
        return !exists;
      });

      this.logger.info(`Saving ${newGists.length} new gists for user ${user}`);

      await this.gistRepository.AddRecent(user, newGists);
    }

    this.logger.info(`Done updating for users ${users}`);
  }

  public async GetRecent(user: string): Promise<GistResponse[]> {
    const recent = await this.gistRepository.GetRecent(user);

    return recent;
  }
}
