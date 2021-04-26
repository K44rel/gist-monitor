import axios from "axios";
import { Logger } from "winston";
import GistRepository from "../repository/gist";
import UserRepository from "../repository/user";
import { GistResponse } from "../types/gist";

export default class GistService {
  constructor(
    private userRepository: UserRepository,
    private gistRepository: GistRepository,
    private logger: Logger
  ) {
    this.userRepository = userRepository;
    this.gistRepository = gistRepository;
    this.logger = logger;
  }

  public async UpdateGists(): Promise<void> {
    const users = await this.userRepository.ListUsers();

    this.logger.info(`Updating recent gists for users ${users}`);

    users.forEach(async (user: string) => {
      const previous = await this.gistRepository.GetRecent(user);

      this.gistRepository.SaveRecents(user, previous);

      this.gistRepository.DeleteRecent(user);

      const gists = await this.requestGists(user);

      this.logger.info(
        `Got ${gists.length} gists from github for user ${user}`
      );

      const newGists = gists.filter((gist) => {
        const exists = this.gistRepository.Exists(user, gist);
        return !exists;
      });

      this.logger.info(`Saving ${newGists.length} new gists for user ${user}`);

      this.gistRepository.AddRecent(user, newGists);
    });
  }

  public async GetRecent(user: string): Promise<GistResponse[]> {
    const recent = await this.gistRepository.GetRecent(user);

    return recent;
  }

  private async requestGists(user: string): Promise<GistResponse[]> {
    this.logger.info(`Requesting gists for user ${user}`);

    const resp = await axios({
      url: `https://api.github.com/users/${user}/gists`,
      method: "GET",
      responseType: "json",
    });

    this.logger.silly(`Github responded ${JSON.stringify(resp.data)}`);

    return resp.data;
  }
}
