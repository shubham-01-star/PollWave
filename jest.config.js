/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",      // TypeScript support
  testEnvironment: "node", // Node environment for Express
  testMatch: ["**/tests/**/*.test.ts"], // test file pattern
  moduleFileExtensions: ["ts", "js", "json", "node"],
  verbose: true,           // detailed logs
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json", // use main tsconfig
    },
  },
  // Optional: ignore migration/generated files
  testPathIgnorePatterns: ["/node_modules/", "/prisma/migrations/"],
};
