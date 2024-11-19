// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  maxWorkers: 2,
  ci: true,
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  clearMocks: true, // Automatically clear mock calls and instances between every test
  automock: false, // All imported modules in your tests should be mocked automatically
  collectCoverage: true, // Indicates whether the coverage information should be collected while executing the test
  coverageDirectory: "coverage", // The directory where Jest should output its coverage files
  coveragePathIgnorePatterns: ["node_modules"], // An array of regexp pattern strings used to skip coverage collection
  rootDir: './',
  globals: {},
  verbose: true,
  notify: true, // Activates notifications for test results
  notifyMode: "failure-change", // An enum that specifies notification mode. Requires { notify: true }
  errorOnDeprecated: false, // Make calling deprecated APIs throw helpful error messages
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>src/$1',
    '^design-component$': '<rootDir>design-component/index.ts',
    "^dexie$": "<rootDir>/node_modules/dexie"
  },
  coverageReporters: ["html-spa", "text"],
  coverageThreshold: {
    global: {
      statements: 100
    }
  },
  testMatch:[ // The glob patterns Jest uses to detect test files
    "<rootDir>src/**/*.spec.[jt]s?(x)",
    "<rootDir>test/**/*.spec.[jt]s?(x)",
    "<rootDir>spec/**/*.spec.[jt]s?(x)",
  ],
}