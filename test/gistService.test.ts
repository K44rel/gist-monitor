import GistService from "../src/service/gist";
import UserRepository from "../src/repository/user";
import GistRepository from "../src/repository/gist";
import GithubService from "../src/service/github";
import RedisInstance from "../src/loaders/redis";
import Logger from "../src/loaders/logger";
import redis from "redis-mock";

jest.mock("../src/loaders/redis");
jest.mock("../src/repository/user");
jest.mock("../src/repository/gist");
jest.mock("../src/service/github");
jest.mock("redis", () => redis);

describe("GistService", function () {
  const redisClient = redis.createClient();
  const logger = Logger;
  const redisInstance = RedisInstance({ redis: redisClient, logger });
  const userRepository = new UserRepository(redisInstance, logger);
  const gistRepository = new GistRepository(redisInstance, logger);
  const githubService = new GithubService(logger);

  const gistService = new GistService(
    userRepository,
    gistRepository,
    githubService,
    logger
  );

  jest.spyOn(userRepository, "ListUsers").mockResolvedValue(["test"]);

  const newGist = {
    url: "testNew",
    forks_url: "testNew",
    commits_url: "testNew",
    id: "testNew",
    node_id: "testNew",
    git_pull_url: "testNew",
    git_push_url: "testNew",
    html_url: "testNew",
    files: null,
    public: true,
    created_at: new Date(),
    updated_at: new Date(),
    description: "testNew",
    comments: 0,
    user: "testNew",
    comments_url: "testNew",
    owner: undefined,
    truncated: false,
  };

  const oldGist = {
    url: "testOld",
    forks_url: "testOld",
    commits_url: "testOld",
    id: "testOld",
    node_id: "testOld",
    git_pull_url: "testOld",
    git_push_url: "testOld",
    html_url: "testOld",
    files: null,
    public: true,
    created_at: new Date(),
    updated_at: new Date(),
    description: "testOld",
    comments: 0,
    user: "testOld",
    comments_url: "testOld",
    owner: undefined,
    truncated: false,
  };

  it("saves gits as recent", async function () {
    const newMockGists = [newGist];

    const addRecentSpy = jest.spyOn(gistRepository, "AddRecent");

    jest.spyOn(githubService, "RequestGists").mockResolvedValue(newMockGists);

    await gistService.UpdateGists();
    expect(addRecentSpy).toBeCalledWith("test", newMockGists);
  });

  it("archives previous recent gists", async function () {
    const oldMockGists = [oldGist];

    const saveRecentsSpy = jest.spyOn(gistRepository, "SaveRecents");

    jest.spyOn(gistRepository, "GetRecent").mockResolvedValue(oldMockGists);

    await gistService.UpdateGists();
    expect(saveRecentsSpy).toBeCalledWith("test", oldMockGists);
  });

  it("only saves new gists as recent", async function () {
    const newMockGists = [oldGist, newGist];
    const oldMockGists = [oldGist];

    const addRecentSpy = jest.spyOn(gistRepository, "AddRecent");

    jest
      .spyOn(gistRepository, "Exists")
      .mockImplementation((user, gist) => (gist === oldGist ? true : false));

    jest.spyOn(githubService, "RequestGists").mockResolvedValue(newMockGists);
    jest.spyOn(gistRepository, "GetRecent").mockResolvedValue(oldMockGists);

    expect(addRecentSpy).toBeCalledWith("test", [newGist]);
  });
});
