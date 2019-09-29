import { Search } from "./search";

test("init", () => {
  const s = new Search();
  expect(s.data.activities).toStrictEqual([]);
});

test("fetch", async () => {
  const data = await import(/* webpackChunkName: "myData" */ "../../lib/data");
  const s = new Search(data);
  expect(s.data.activities).not.toStrictEqual([]);
});
