import { Search } from "./search";

describe("object initialization", () => {
  test("init", () => {
    const s = new Search();
    expect(s.data.activities).toStrictEqual([]);
  });

  test("fetch", async () => {
    const data = await import(
      /* webpackChunkName: "myData" */ "../../lib/data"
    );
    const s = new Search(data);
    expect(s.data.activities).not.toStrictEqual([]);
  });
});

describe("test with data", () => {
  let search;
  beforeEach(async () => {
    const data = await import(
      /* webpackChunkName: "myData" */ "../../lib/data"
    );
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

    describe("actorTypes", () => {
      test("search has data loaded for beforeEach", async () => {
        const results = search.getCounts();
        expect(results).toHaveProperty("actorTypes");

        expect(results.actorTypes).toHaveProperty("Company");
        expect(results.actorTypes).toHaveProperty("Company.count");
        expect(results.actorTypes).toHaveProperty("Company.count", 14);

        expect(results.actorTypes).toHaveProperty("Website");
        expect(results.actorTypes).toHaveProperty("Website.count");
        expect(results.actorTypes).toHaveProperty("Website.count", 3);
      });
    });

    describe("actors", () => {
      test("search has data loaded for beforeEach", async () => {
        const results = search.getCounts();
        expect(results).toHaveProperty("actors");

        expect(results.actors).toHaveProperty("werkzeug");
        expect(results.actors).toHaveProperty("werkzeug.count");
        expect(results.actors).toHaveProperty("werkzeug.count", 3);
      });
    });

    describe("languages", () => {
      test("search has data loaded for beforeEach", async () => {
        const results = search.getCounts();
        expect(results).toHaveProperty("languages");

        expect(results.languages).toHaveProperty("Shell");
        expect(results.languages).toHaveProperty("Shell.count");
        expect(results.languages).toHaveProperty("Shell.count", 5);
        expect(results.languages).toHaveProperty("Python");
        expect(results.languages).toHaveProperty("Python.count");
        expect(results.languages).toHaveProperty("Python.count", 186);
        expect(results.languages).toHaveProperty("TypeScript");
        expect(results.languages).toHaveProperty("TypeScript.count");
        expect(results.languages).toHaveProperty("TypeScript.count", 4);
      });
    });
  });
});
