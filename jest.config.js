export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "<rootDir>/tsconfig.json"
    }
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest"]
  },
  moduleNameMapper: {
    // allow importing .js paths from TS files (common with ESM builds)
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};