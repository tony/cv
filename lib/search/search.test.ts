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

  describe("getResults()", async () => {
    test("search has data loaded for beforeEach", () => {
      const results = search.getResults();
      expect(results).toHaveProperty("activities");
      expect(results.activities.length).toBeGreaterThan(10);
    });
  });

  describe("getSelectedStats()", async () => {
    test("search has data loaded for beforeEach", async () => {
      const results = search.getSelectedStats();
      expect(results).toHaveProperty("activityTypes");

      expect(results.activityTypes).toHaveProperty("SoftwareApp");
      expect(results.activityTypes).toHaveProperty("SoftwareApp.count");
      expect(results.activityTypes).toHaveProperty("SoftwareApp.count", 4);
    });
  });
});
