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
    return search;
  });

  test("search has data loaded for beforerEach", () => {
    expect(search.data.activities).not.toStrictEqual([]);
  });
});
