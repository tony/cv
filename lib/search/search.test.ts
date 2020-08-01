import { Search } from "./search";

describe("object initialization", () => {
  test("init", () => {
    const s = new Search();
    expect(s.data.activities).toStrictEqual([]);
  });

  test("fetch", async () => {
    const data = await import("../../lib/data");
    const s = new Search(data);
    expect(s.data.activities).not.toStrictEqual([]);
  });
});

describe("test with data", () => {
  let search;
  beforeEach(async () => {
    const data = await import("../../lib/data");
    search = new Search(data);
  });

  test("search has data loaded for beforeEach", () => {
    expect(search.data).toHaveProperty("activities");
    expect(search.data.activities.length).toBeGreaterThan(10);
  });

  describe("getData()", () => {
    test("search has data loaded for beforeEach", () => {
      const data = search.getData();
      expect(data).toHaveProperty("activities");
      expect(data.activities.length).toBeGreaterThan(10);
    });
  });

  describe("getResults()", () => {
    test("search has data loaded for beforeEach", () => {
      const results = search.getResults();
      expect(results).toHaveProperty("activities");
      expect(results.activities.length).toBeGreaterThan(10);
    });
  });

  describe("getCounts()", () => {
    describe("activityTypes", () => {
      test("search has data loaded for beforeEach", async () => {
        const results = search.getCounts();
        expect(results).toHaveProperty("activityTypes");

        expect(results.activityTypes).toHaveProperty("SoftwareApp");
        expect(results.activityTypes).toHaveProperty("SoftwareApp.count");
        expect(results.activityTypes).toHaveProperty("SoftwareApp.count", 4);
      });
    });

    describe("orgTypes", () => {
      test("search has data loaded for beforeEach", async () => {
        const results = search.getCounts();
        expect(results).toHaveProperty("orgTypes");

        expect(results.orgTypes).toHaveProperty("Company");
        expect(results.orgTypes).toHaveProperty("Company.count");
        expect(results.orgTypes).toHaveProperty("Company.count", 7);

        expect(results.orgTypes).toHaveProperty("Website");
        expect(results.orgTypes).toHaveProperty("Website.count");
        expect(results.orgTypes).toHaveProperty("Website.count", 2);
      });
    });

    describe("orgs", () => {
      test("search has data loaded for beforeEach", async () => {
        const results = search.getCounts();
        expect(results).toHaveProperty("orgs");

        expect(results.orgs).toHaveProperty("werkzeug");
        expect(results.orgs).toHaveProperty("werkzeug.count");
        expect(results.orgs).toHaveProperty("werkzeug.count", 3);
      });
    });

    describe("languages", () => {
      test("search has data loaded for beforeEach", async () => {
        const results = search.getCounts();
        expect(results).toHaveProperty("languages");

        expect(results.languages).toHaveProperty("Shell");
        expect(results.languages).toHaveProperty("Shell.count");
        expect(results.languages.Shell.count).toBeGreaterThanOrEqual(4);
        expect(results.languages).toHaveProperty("Python");
        expect(results.languages).toHaveProperty("Python.count");
        expect(results.languages.Python.count).toBeGreaterThanOrEqual(207);
        expect(results.languages).toHaveProperty("TypeScript");
        expect(results.languages).toHaveProperty("TypeScript.count");
        expect(results.languages.TypeScript.count).toBeGreaterThanOrEqual(8);
      });
    });
  });
});
