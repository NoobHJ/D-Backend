const jestConfig = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js", "./jest.teardown.js"],
  testTimeout: 20000,
};

export default jestConfig;
