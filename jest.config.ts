import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest =  {
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: "v8",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      }
    ],
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
};
export default jestConfig;