import { ActivitiesStore, CVStore } from "./store";
import type { IData } from "../data/fetch";

describe("CVStore", () => {
  test("init", () => {
    const s = new CVStore();
    expect(s.getValue()).toStrictEqual({});
  });
});

describe("ActivitiesStore", () => {
  test("init", () => {
    const s = new ActivitiesStore();
    expect(s.getValue().activities).toBeUndefined();
  });

  test("init with data", async () => {
    const data: IData = await import("../../lib/data/raw");
    const s = new ActivitiesStore();
    s.set(data.activities);
    expect(s.getValue()).not.toStrictEqual([]);
  });
});

describe("test with data", () => {
  beforeEach(async () => {
    const data: IData = await import("../../lib/data/raw");
    const { loadStores } = await import("../../lib/hub");
    loadStores(data);
  });

  test("has data loaded for beforeEach", async () => {
    const { activitiesQuery } = await import("../../lib/hub");
    expect(activitiesQuery.getCount()).toBeGreaterThan(10);
  });
});
