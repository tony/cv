import { Search } from "./search";

test("init", () => {
  const s = new Search();
  expect(s.data.activities).toStrictEqual([]);
});
