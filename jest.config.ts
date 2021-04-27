import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  moduleFileExtensions: ["js", "ts", "json"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};
export default config;
