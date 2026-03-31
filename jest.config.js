const dotEnv = require("dotenv");
const nextJest = require("next/jest");

dotEnv.config({
  path: ".env.development",
});

const createJestConfig = nextJest({
  dir: ".",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
