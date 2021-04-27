import axios from "axios";
import { Logger } from "winston";
import { GistResponse } from "../types/gist";

export default class GithubService {
  constructor(private logger: Logger) {
    this.logger = logger;
  }

  public async RequestGists(user: string): Promise<GistResponse[]> {
    this.logger.info(`Requesting gists for user ${user}`);

    const resp = await axios({
      url: `https://api.github.com/users/${user}/gists`,
      method: "GET",
      responseType: "json",
    });

    this.logger.info(`Github responded with ${resp.data.length} gists`);

    return resp.data;
  }
}
